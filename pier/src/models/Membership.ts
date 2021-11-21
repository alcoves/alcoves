import { UserInterface } from './User'
import { HarbourInterface } from './Harbour'
import { Schema, model, Types, PopulatedDoc } from 'mongoose'

export interface MembershipInterface {
  _id: Types.ObjectId
  role: string
  user: PopulatedDoc<UserInterface & Document>
  harbour: PopulatedDoc<HarbourInterface & Document>
}

const membershipSchema = new Schema<MembershipInterface>(
  {
    _id: Schema.Types.ObjectId,
    role: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'BkenUser' },
    harbour: { type: Schema.Types.ObjectId, ref: 'Harbour' },
  },
  { timestamps: true }
)

export const Membership = model<MembershipInterface>('Membership', membershipSchema)
