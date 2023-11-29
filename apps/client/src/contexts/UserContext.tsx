import { LOCALSTORAGE_TOKEN_KEY } from '../lib/util'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface User {
  token: string
}

interface UserContextProps {
  user: User | null
  isLoading: boolean
  logout: () => void
  login: (token: string) => void
}

interface UserProviderProps {
  children: ReactNode
}

const UserContext = createContext<UserContextProps | null>(null)

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)
    if (token) setUser({ token })
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    setIsLoading(true)
    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token)
    setUser({ token })
    setIsLoading(false)
  }

  const logout = () => {
    setIsLoading(true)
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY)
    setUser(null)
    setIsLoading(false)
  }

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
