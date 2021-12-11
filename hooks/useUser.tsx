import jwt from 'jwt-decode'
import cookies from 'js-cookie'
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
    router.push('/')
  }

  useEffect(() => {
    const jwtToken = cookies.get('token')
    if (jwtToken) {
      const user = jwt<User>(jwtToken)
      if (user && user.id) {
        if (Date.now() >= user.exp * 1000) {
          logout()
          setAuthenticated(false)
          setLoading(false)
        } else {
          setUser(user)
          setAuthenticated(true)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  return { user, authenticated, loading, logout, login }
}

export function getUserSync(): any {
  const jwtToken = cookies.get('token')
  if (jwtToken) {
    const user = jwt<User>(jwtToken)
    if (Date.now() >= user.exp * 1000) {
      cookies.remove('token')
      window.location.replace('/login')
    } else {
      return { user }
    }
  }
  return null
}
