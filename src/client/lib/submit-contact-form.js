export default async function({ form, router, currentLocale }) {
  try {
    const body = new URLSearchParams()

    Object.keys(form).forEach(key => {
      body.append(key, form[key])
    })
    
    await fetch('./', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    router.push({
      name: 'locale-contact-slug',
      params: { slug: 'confirmation', locale: currentLocale }
    })
  } catch (error) {
    router.push({
      name: 'locale-contact-slug',
      params: { slug: 'error', locale: currentLocale }
    })
  }
}
