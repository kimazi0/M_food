import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

// next-auth v4 — config object only, handler created in the route file
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Demo admin – no DB needed
        if (
          credentials.email === "admin@mfood.com" &&
          credentials.password === "admin123"
        ) {
          return { id: "1", email: credentials.email, name: "Admin", role: "ADMIN" };
        }

        // Lazy DB look-up (avoids Prisma instantiation at build time)
        try {
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (user && user.password === credentials.password) {
            return { id: user.id, email: user.email, name: "Staff", role: user.role };
          }
        } catch {
          // DB not available during static build – that's fine
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "fallback_for_local_dev",
};

// Helper to read session in Server Components / middleware
export { getServerSession } from "next-auth";
