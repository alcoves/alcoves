import axios from 'axios'

export function purgeURL(url: string) {
  const accessKey = process.env.BUNNY_ACCESS_KEY
  if (!accessKey) return console.error('invalid bunny access key')

  console.log(`Purging URL ${url} from cdn`)
  return axios({
    method: 'POST',
    headers: { AccessKey: accessKey },
    url: `https://api.bunny.net/purge?url=${url}`,
  })
}
