import { spawn } from "child_process";

export async function runFFmpeg({
  input,
  output,
  commands,
  onProgress,
}: {
  input: string;
  output: string;
  commands: string[];
  onProgress?: (progress: number, estimatedTimeRemaining: string) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if ffmpeg is installed
    const versionCheck = spawn("ffmpeg", ["-version"]);
    versionCheck.on("error", () => {
      reject(new Error("FFmpeg is not installed or not accessible"));
      return;
    });

    let errorMessage = "";
    const args = ["-y", "-i", input, ...commands, output];
		console.info('FFMpeg Arguments', args.join(' '))
    const ffmpeg = spawn("ffmpeg", args);
    const startTime = Date.now();
    let durationSeconds = 0;
    let currentTime = 0;

    // Capture error output
    ffmpeg.stderr.setEncoding("utf8");
    ffmpeg.stderr.on("data", (data: string) => {
      const dataStr = data.toString();
      errorMessage += dataStr; // Collect error messages

      // Duration parsing
      const durationMatch = dataStr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (durationMatch) {
        const hours = Number.parseFloat(durationMatch[1]);
        const minutes = Number.parseFloat(durationMatch[2]);
        const seconds = Number.parseFloat(durationMatch[3]);
        durationSeconds = hours * 3600 + minutes * 60 + seconds;
      }

      // Progress parsing
      const timeMatch = dataStr.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (timeMatch) {
        const hours = Number.parseFloat(timeMatch[1]);
        const minutes = Number.parseFloat(timeMatch[2]);
        const seconds = Number.parseFloat(timeMatch[3]);
        currentTime = hours * 3600 + minutes * 60 + seconds;

        if (durationSeconds) {
          const progress = (currentTime / durationSeconds) * 100;
          const elapsedTime = (Date.now() - startTime) / 1000;
          const estimatedTotalTime = elapsedTime / (progress / 100);
          const estimatedTimeRemaining = estimatedTotalTime - elapsedTime;
          const formattedEtr = formatTime(estimatedTimeRemaining);
          if (onProgress) {
            onProgress(Math.floor(progress), formattedEtr);
          }
        }
      }
    });

    ffmpeg.on("error", (error) => {
      console.error("Error occurred in FFmpeg process:", error);
      reject(new Error(`FFmpeg process error: ${error.message}\n${errorMessage}`));
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
          if (onProgress) {
            onProgress(100, "00:00:00");
          }
        resolve();
      } else {
        console.error("FFmpeg stderr output:", errorMessage);
        reject(
          new Error(
            `FFmpeg exited with code ${code}. Error output: ${errorMessage}`
          )
        );
      }
    });

    // Validate input file exists
    ffmpeg.stdin.on("error", (error) => {
      reject(new Error(`Input file error: ${error.message}`));
    });
  });
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => (v < 10 ? "0" + v : v)).join(":");
}