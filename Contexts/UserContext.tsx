import * as api from '../lib/api'
import { UserContextProps } from '../types/types'
import { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext({})

function UserProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({
    id: 0,
    email: '',
    username: '',
    isAuthenticated: false,
  })

  useEffect(() => {
    getMe()
  }, [])

  // Sends a request to the server to fetch the current user
  async function getMe() {
    try {
      setLoading(true)
      const user = await api.getMe()

      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          isAuthenticated: true,
          username: user.username,
        })
      }
    } catch (error) {
      // console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function login({ email, password }: { email: string; password: string }) {
    try {
      setLoading(true)
      await api.login({ email, password })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      setLoading(true)
      // api.logout()
      // setUser null
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider
      value={
        {
          user,
          login,
          logout,
          loading,
        } as UserContextProps
      }
    >
      {children}
    </UserContext.Provider>
  )
}

function useUser(): UserContextProps {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context as UserContextProps
}

export { UserProvider, useUser }
