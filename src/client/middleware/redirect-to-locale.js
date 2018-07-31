export default function redirectToLocale({ route, redirect }) {
  const availableLocales = ['en', 'nl']
  const defaultLocale = 'en'
  const { fullPath } = route

  if (fullPath === '/') {
    redirect(301, `/${defaultLocale}/`)
    return
  }

  const [,, locale] = /(\/)([\w]+)/.exec(fullPath)
  if (availableLocales.indexOf(locale) === -1) {
    redirect(301, `/${defaultLocale}${fullPath}`)
  }
}
