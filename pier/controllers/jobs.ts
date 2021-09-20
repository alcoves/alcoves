import { Request, Response } from "express";
import { Job } from "../lib/models";

export async function get(req: Request, res: Response) {
  // Highest priority jobs first
  const packagingJob = await Job.findOne({ type: 'package', status: 'queued' })
  if (packagingJob) {
    const incompleteTranscodeFilter = {
      type: "transcode",
      video: packagingJob._id,
      status: { $ne: 'running' }, // TODO :: Replace with status ne 'completed'
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
