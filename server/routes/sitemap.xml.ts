import { SitemapStream, streamToPromise } from 'sitemap'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const sitemap = new SitemapStream({
    hostname: 'https://valentingenest.com'
  })

  // Add static pages
  sitemap.write({
    url: '/fr',
    changefreq: 'monthly',
    priority: 1
  })

  sitemap.write({
    url: '/en',
    changefreq: 'monthly',
    priority: 1
  })

  sitemap.end()

  return streamToPromise(sitemap)
    .then(data => {
      event.node.res.setHeader('content-type', 'application/xml')
      event.node.res.end(data.toString())
    })
}) 