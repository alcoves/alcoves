import { x264, x264Package } from "../lib/video/ffCommands"
import { getPresets, Preset} from "../lib/video/getJobs"
import { getMetadata, Metadata } from "../lib/video/getMetadata"

describe("ffCommands", () => {
  test("that ffmpeg commands are generated 1/3", () => {
    const metadata: Metadata = {
      audio: {
        index: 0,
      },
      video: {
        index: 0,
        width: 2280,
        height: 1080
      },
      format: {
        width: 2280,
        height: 1080
      }
    }

    const presets: Preset[] = [
      {
        name: "360p",
        width: 1920,
        height: 1080,
        defaultMaxRate: 3000
      }
    ]

    expect(x264(metadata, presets)).toMatchSnapshot()
  })

  test("that ffmpeg commands are generated 2/3", () => {
    const metadata: Metadata = {
      audio: {
        index: 0,
      },
      video: {
        index: 0,
        width: 2280,
        height: 1080
      },
      format: {
        width: 2280,
        height: 1080
      }
    }

    const presets: Preset[] = [
      {
        name: "360p",
        width: 1920,
        height: 1080,
        defaultMaxRate: 3000
      }
    ]

    const x264Args = x264(metadata, presets)
    expect(x264Package(x264Args)).toMatchSnapshot()
  })
})

describe('full ffmpeg command generation tests', () => {
  test("that ffmpeg commands are generated 3/3", () => {
    const metadata: Metadata = {
      audio: {
        index: 0,
      },
      video: {
        index: 0,
        width: 1920,
        height: 1080
      },
      format: {
        width: 1920,
        height: 1080
      }
    }

    const presets = getPresets(metadata)
    const x264Args = x264(metadata, presets)
    const fullArgs = x264Package(x264Args)

    expect(presets).toMatchSnapshot()
    expect(x264Args).toMatchSnapshot()
    expect(fullArgs).toMatchSnapshot()
    expect(fullArgs.join(' ')).toMatchSnapshot()
  })
})