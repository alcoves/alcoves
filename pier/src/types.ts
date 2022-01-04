export interface TidalWebhookBody {
  data: any
  returnValue: any
  progress: number
  isFailed: boolean
  id: string | undefined
  name: string | undefined
  queueName: string | undefined
}
