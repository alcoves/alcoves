import cookies from 'js-cookie'
import jwt from 'jwt-decode'
import Router from 'next/router'
import create from 'zustand'

import { User, UserState } from '../types/types'

export const userStore = create<UserState>((set: any, get: any) => {
  return {
    user: null,
    loading: true,
    authenticated: false,
    login: (t?: string) => {
      const logout = get().logout

      if (t) cookies.set('token', t)
      const token = t ? t : (cookies.get('token') as string)
      if (!token) return logout()

      const tokenUser: any = jwt<User>(token)
      if (!tokenUser && !tokenUser.id) return logout()
      if (Date.now() >= tokenUser.exp * 1000) return logout()

      set({ user: tokenUser, authenticated: true, loading: false })
    },
    logout: () => {
      cookies.remove('token')
      set({
        user: null,
        loading: false,
        authenticated: false,
      })
      Router.push('/login')
    },
  }
})
