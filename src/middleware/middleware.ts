import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}