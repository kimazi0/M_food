import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
    </div>
  );
}
