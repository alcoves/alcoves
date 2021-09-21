import { Request, Response } from "express";
import { Job, Video } from "../lib/models";

export async function get(req: Request, res: Response) {
  // Highest priority jobs first
  const packagingJob = await Job.findOne({ type: 'package', status: 'queued' })
  if (packagingJob) {
    const incompleteTranscodeFilter = {
      type: "transcode",
      // eslint-disable-next-line
      // @ts-ignore
      video: packagingJob.video,
      status: { $ne: 'completed' },
    }

    const incompleteTranscodeJob = await Job.findOne(incompleteTranscodeFilter)
    if (!incompleteTranscodeJob) {
      console.log("Transcoding jobs done, continue with package job")
      await Job.updateOne({ _id: packagingJob._id }, { status: 'running' })
      return res.json(packagingJob)
    }
  }

  // Lower priority jobs
  const job = await Job.findOne({ status: 'queued', type: { $ne: 'package' } })
  if (job) {
    await Job.updateOne({ _id: job._id }, { status: 'running' })
    return res.json(job)
  }
  return res.sendStatus(200)
}

export async function patch(req: Request, res: Response) {
  const job = await Job.findOneAndUpdate({ _id: req.params.jobId }, { ...req.body })
  // eslint-disable-next-line
  // @ts-ignore
  if (req.body.status === "completed" && job.type === 'package') {
    console.log("Package job is done, updating video status")
    // eslint-disable-next-line
    // @ts-ignore
    await Video.findOneAndUpdate({ _id: job.video }, { status: 'completed' })
  }
  return res.sendStatus(200)
}
