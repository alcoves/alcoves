import * as api from '../lib/api'
import { UserContextProps } from '../types/types'
import { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext({})

const initialUser = {
  id: 0,
  email: '',
  username: '',
  isAuthenticated: false,
}

function UserProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    getMe()
  }, [])

  // Sends a request to the server to fetch the current user
  async function getMe() {
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

    setLoading(false)
  }

  async function login({ email, password }: { email: string; password: string }) {
    setLoading(true)
    await api.login({ email, password })
    setLoading(false)
  }

  async function logout() {
    setLoading(true)
    await api.logout()
    setUser(initialUser)
    setLoading(false)
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
