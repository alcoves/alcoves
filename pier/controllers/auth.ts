

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import  { Types } from 'mongoose'
import { Request, Response } from "express"
import { User2 } from "../models/models"

let JWT_SECRET: string

if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET
} else {
  throw new Error('process.env.JWT_SECRET must be defined!')
}

function getToken(email: string, userId: string): string {
 return jwt.sign(
  { email, userId }, JWT_SECRET, { expiresIn: "1h"}
);
}

export async function login(req: Request, res: Response) {
  const user = await User2.findOne({ email: req.body.email })
  if (!user) return res.sendStatus(404)

  const compare = await bcrypt.compare(req.body.password, user.password)
  if (!compare) return res.status(401)
  
  return res.status(200).send({
    token: getToken(user.email, user._id),
  })
}
export async function register(req: Request, res: Response) {
  const userExists = await User2.findOne({email: req.body.email})
  if (userExists) return res.sendStatus(400)
  const hash = await bcrypt.hash(req.body.password, 10)
  
  const user = await new User2({
    _id: new Types.ObjectId(),
    password: hash,
    email: req.body.email,
  }).save()

  return res.status(200).send({
    token: getToken(user.email, user._id),
  })
}