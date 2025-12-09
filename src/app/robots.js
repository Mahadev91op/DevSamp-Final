export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Admin panel ko SEO se chupana zaroori hai
    },
    sitemap: 'https://devsamp.com/sitemap.xml', // Apna domain update karein
  }
}