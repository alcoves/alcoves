import { Metadata } from "./getMetadata"

// CalcMaxBitrate uses the videos original bitrate to determine what the max should be
// func CalcMaxBitrate(originalWidth int, desiredWidth int, bitrate int) int {
// vidRatio := float64(desiredWidth) / float64(originalWidth)
// return int(vidRatio * float64(bitrate) / 1000)
// }

function calcResizeFilter (w: number): string {
  return `scale=${w}:${w}:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2`
}

export function getX264Args (m: Metadata, width: number, height: number, url: string): string {
  let videoFilter = calcResizeFilter(width)
  if (m.video.r_frame_rate) {
    console.info("Applying framerate to video filter")
    videoFilter += `,fps=fps=${m.video.r_frame_rate}`
  }

  // https://superuser.com/questions/908280/what-is-the-correct-way-to-fix-keyframes-in-ffmpeg-for-dash
  const commands = [
    "-y",
    "-i", url,
    "-c:v", "libx264",
    "-vf", videoFilter,
    "-crf", "22",
    "-preset", "medium",
    "-bf", "2",
    "-coder", "1",
    "-profile", "high",
    "-x264opts", "keyint=48:min-keyint=48:no-scenecut",
    "-pix_fmt", "yuv420p",
    `./${height}p.mp4`
  ]

  if (m?.format?.bit_rate) {
    // TODO :: apply max bitrate
    // https://github.com/bkenio/tidal/blob/main/utils/x264.go
  } else {
    // TODO :: apply default bitrates
  }

  return commands.join(" ")
}