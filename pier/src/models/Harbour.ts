import { Schema, model, Types, PopulatedDoc } from 'mongoose'
import { UserInterface } from './User'

export interface HarbourInterface {
  _id: Types.ObjectId
  image: string
  name: string
  owner: PopulatedDoc<UserInterface & Document>
  users: PopulatedDoc<UserInterface & Document>[]
}

const harbourSchema = new Schema<HarbourInterface>(
  {
    _id: Schema.Types.ObjectId,
    image: { type: String },
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'BkenUser' },
    users: [{ type: Schema.Types.ObjectId, ref: 'BkenUser' }],
  },
  { timestamps: true }
)

export const Harbour = model<HarbourInterface>('Harbour', harbourSchema)
