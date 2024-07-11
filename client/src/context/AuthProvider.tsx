import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { API_URL } from '../lib/env'

interface User {
    email: string
    avatar: string
    id: string
}

export const AuthContext = createContext<{
    user: User | null
    loading: boolean
    logout: () => void
    login: (data: unknown) => Promise<void>
}>({
    user: null,
    loading: true,
    login: async () => {},
    logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    const login = useCallback(async () => {
        try {
            console.info('Attemping to log the user in')
            setLoading(true)
            // call the /me endpoint to get the user info
            const { payload: user } = await fetch(`${API_URL}/api/users/me`, {
                credentials: 'include',
            }).then((res) => res.json())

            setUser(user)
            console.info(`The user ${user.id} is logged in`)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        // navigate('/auth/login', { replace: true })
    }, [])

    useEffect(() => {
        login()
    }, [login])

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            logout,
        }),
        [user, loading, login, logout]
    )
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
