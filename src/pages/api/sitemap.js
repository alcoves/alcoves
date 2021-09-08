import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

export default async function Sitemap(req, res) {
  const links = [
    {
      url: '/',
      changefreq: 'daily',
      priority: 0.3,
    },
    {
      url: '/login',
      changefreq: 'daily',
      priority: 0.3,
    },
  ]

  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` })
  res.writeHead(200, { 'Content-Type': 'application/xml' })
  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data =>
    data.toString()
  )

  res.end(xmlString)
}
