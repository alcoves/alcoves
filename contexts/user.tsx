import React from 'react'
import { UserState } from '../types/types'

const obj: UserState = {
  user: null,
  loading: true,
  authenticated: false,
  login: () => {
    return
  },
  logout: () => {
    return
  },
}
const UserContext = React.createContext(obj)

export { UserContext }
