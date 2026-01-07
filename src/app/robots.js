export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://www.devsamp.online/sitemap.xml', // यहाँ नया डोमेन अपडेट करें
  }
}