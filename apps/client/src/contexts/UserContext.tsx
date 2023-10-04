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
  login: (userData: User, token: string) => void
  logout: () => void
}

interface UserProviderProps {
  children: ReactNode
}

const UserContext = createContext<UserContextProps | null>(null)

const LOCALSTORAGE_TOKEN_KEY = 'alcoves_user'

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)

    if (token) {
      // TODO: Fetch user data using the token
      setUser({
        id: '1',
        username: 'test',
      })
    }
  }, [])

  const login = (userData: User, token: string) => {
    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY)
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProps & { isAuthenticated: boolean } => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  const isAuthenticated = Boolean(context.user)

  return { ...context, isAuthenticated }
}
