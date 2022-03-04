interface TidalWebhookBodyData {
  entityId: string
}
export interface TidalWebhookBody {
  returnValue: any
  progress: number
  isFailed: boolean
  id: string | undefined
  name: string | undefined
  data: TidalWebhookBodyData
  queueName: string | undefined
}
