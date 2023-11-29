export function megabytesToSize(bytes: number): string {
  bytes = bytes * 1024 * 1024 // We convert to bytes because the db stores in mb
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  let timeString = ''

  if (hours > 0) {
    timeString += `${hours.toString().padStart(2, '0')}:`
  }

  timeString += `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`

  if (hours === 0 && minutes < 10) {
    timeString = timeString.substr(1)
  }

  return timeString
}

// export function groupItemsByDay(items: Video[]): {
//   [timestamp: string]: Video[]
// } {
//   const groups: { [timestamp: string]: Video[] } = {}

//   for (const item of items) {
//     const date = new Date(item.authoredAt).toISOString().slice(0, 10) // Extract YYYY-MM-DD string

//     if (!groups[date]) {
//       groups[date] = []
//     }

//     groups[date].push(item)
//   }

//   return groups
// }

export function getRgbaFromString(str: string, alpha: number): string {
  // Generate a hash code from the string
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Extract 3 values from the hash code
  const r = (hash >> 8) & 0xff
  const g = (hash >> 4) & 0xff
  const b = hash & 0xff

  // Construct the RGB value
  return `rgb(${r}, ${g}, ${b}, ${alpha})`
}

export function getGradientFromString(str: string): string {
  // Generate a hash code from the string
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Extract 4 values from the hash code
  const r = (hash >> 16) & 0xff
  const g = (hash >> 8) & 0xff
  const b = hash & 0xff
  const a = 0.4

  // Construct the RGBA value
  // return `rgba(${r}, ${g}, ${b}, ${a})`

  // Adjust the RGB values to create a smaller range of color variation
  const r2 = (r + 16) % 256
  const g2 = (g + 32) % 256
  const b2 = (b + 48) % 256

  // Construct gradient colors
  const color1 = `rgb(${r}, ${g}, ${b}, ${a})`
  const color2 = `rgb(${r2}, ${g2}, ${b2}, ${a})`
  // Construct gradient string
  return `linear-gradient(to bottom right, ${color1}, ${color2})`
}

export function isValidURL(url: string) {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}

export const LOCALSTORAGE_TOKEN_KEY = 'alcoves_token'
