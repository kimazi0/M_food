import { getRequestConfig } from 'next-intl/server';
import { locales } from '../navigation';
import { notFound } from 'next/navigation';

export default getRequestConfig(async (params: any) => {
  // In some versions of next-intl/next.js, the locale might be in requestLocale
  let locale = params.locale;
  if (!locale && params.requestLocale) {
    locale = await params.requestLocale;
  }
  
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }

  return {
    locale: locale as string,
    messages: (await import(`../../locales/${locale}/common.json`)).default
  };
});
