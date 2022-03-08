import cookies from 'js-cookie'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { User, UserState } from '../types/types'

export default function useUser(): UserState {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  function logout() {
    cookies.remove('token')
    setAuthenticated(false)
    setUser(null)
    router.push('/login')
  }

  function login(token: string) {
    cookies.set('token', token)
    const user = jwt<User>(token)
    if (user && user.id) {
      if (Date.now() >= user.exp * 1000) {
        // This is where we could refresh the user token
        logout()
        setAuthenticated(false)
        setLoading(false)
        router.push('/')
      } else {
        setUser(user)
        setAuthenticated(true)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    const jwtToken = cookies.get('token')
    if (jwtToken) {
      login(jwtToken)
    } else {
      setLoading(false)
    }
  }, [])

  return { user, authenticated, loading, logout, login }
}
