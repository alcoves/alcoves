import { HarbourInterface } from './Harbour'
import { Schema, model, Types, PopulatedDoc } from 'mongoose'

export interface ChannelInterface {
  _id: Types.ObjectId
  name: string
  harbour: PopulatedDoc<HarbourInterface & Document>
}

const channelSchema = new Schema<ChannelInterface>(
  {
    _id: Schema.Types.ObjectId,
    harbour: { type: Schema.Types.ObjectId, ref: 'Harbour' },
    name: { type: String, required: true, default: 'New Channel' },
  },
  { timestamps: true }
)

export const Channel = model<ChannelInterface>('Channel', channelSchema)
