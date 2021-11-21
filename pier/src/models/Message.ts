import { UserInterface } from './User'
import { HarbourInterface } from './Harbour'
import { Schema, model, Types, PopulatedDoc } from 'mongoose'

export interface MessageInterface {
  _id: Types.ObjectId
  content: string
  user: PopulatedDoc<UserInterface & Document>
  channel: PopulatedDoc<HarbourInterface & Document>
}

const messageSchema = new Schema<MessageInterface>(
  {
    _id: Schema.Types.ObjectId,
    content: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'BkenUser' },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
  },
  { timestamps: true }
)

messageSchema.index({ channel: 1, createdAt: 1 }, { unique: false })

export const Message = model<MessageInterface>('Message', messageSchema)
