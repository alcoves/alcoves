enum JobState {
  failed = 'failed',
  active = 'active',
  waiting = 'waiting',
  delayed = 'delayed',
  unknown = 'unknown',
  completed = 'completed',
  waiting_children = 'waiting-children',
}
export interface TidalWebhookBody {
  data: any
  returnValue: any
  progress: number
  state: JobState
  id: string | undefined
  name: string | undefined
  queueName: string | undefined
}
