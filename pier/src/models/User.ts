import{ Schema, model, Types  } from "mongoose"

export interface UserInterface {
  _id: Types.ObjectId,
  email: string,
  image: string,
  username: string,
  password: string,
}

const userSchema = new Schema<UserInterface>({
  _id: Schema.Types.ObjectId,
  image: { type: String },
  password: { type: String, required: true },
  username: {type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
}, { timestamps: true })

export const User = model<UserInterface>("BkenUser", userSchema)