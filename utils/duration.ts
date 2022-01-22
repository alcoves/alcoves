import { Duration } from 'luxon'

export default function duration(d: number) {
  if (d) {
    return d > 3600
      ? Duration.fromMillis(d * 1000).toFormat('h:mm:ss')
      : Duration.fromMillis(d * 1000).toFormat('m:ss')
  }
  return '0:00'
}
