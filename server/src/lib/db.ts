import { Lucia } from 'lucia'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'

export const db = new PrismaClient()
export const lucia = new Lucia(new PrismaAdapter(db.session, db.user))
