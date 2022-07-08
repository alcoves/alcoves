export function parseFramerate(r_frame_rate: string): number {
  let framerate: number

  if (r_frame_rate.includes('/')) {
    // Probably like 60/1 or something
    const [frames, time] = r_frame_rate.split('/')
    framerate = parseFloat(frames) / parseFloat(time)
  } else {
    // Probably like 23.976
    framerate = parseFloat(r_frame_rate)
  }

  if (framerate <= 15.1 && framerate >= 14.9) {
    return 15
  }

  if (framerate <= 25.1 && framerate >= 23.9) {
    return 24
  }

  if (framerate <= 30.1 && framerate >= 29.9) {
    return 30
  }

  if (framerate <= 60.1 && framerate >= 59.9) {
    return 60
  }

  if (framerate > 60.1) {
    return 60
  }

  return Math.round(framerate)
}
