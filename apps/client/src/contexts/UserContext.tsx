import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface User {
  // Add fields that are relevant for your user object
  id: string
  username: string
}

interface UserContextProps {
  user: User | null
  isLoading: boolean
  logout: () => void
  login: (userData: User, token: string) => void
}

interface UserProviderProps {
  children: ReactNode
}

const UserContext = createContext<UserContextProps | null>(null)

const LOCALSTORAGE_TOKEN_KEY = 'alcoves_user'

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)

    if (token) {
      // TODO: Fetch user data using the token
      setUser({
        id: '1',
        username: 'test',
      })

      setIsLoading(false)
    }
  }, [])

  const login = (userData: User, token: string) => {
    setIsLoading(true)
    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token)
    setUser(userData)
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
