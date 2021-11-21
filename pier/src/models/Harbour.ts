import { Schema, model, Types } from 'mongoose'

export interface HarbourInterface {
  _id: Types.ObjectId
  image: string
  name: string
}

const harbourSchema = new Schema<HarbourInterface>(
  {
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true, default: 'New Harbour' },
    image: { type: String, required: true, default: 'https://cdn.bken.io/files/harbour.png' },
  },
  { timestamps: true }
)

export const Harbour = model<HarbourInterface>('Harbour', harbourSchema)
