import React from 'react'
import { UserState } from '../types/types'

const obj: UserState = {}
const UserContext = React.createContext(obj)

export { UserContext }
