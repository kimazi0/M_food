import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';

export default async function proxy(request: any) {
  return createMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix
  })(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en|fr)/:path*', '/((?!api|admin|_next|_static|_vercel|[\\w-]+\\.\\w+).*)']
};
