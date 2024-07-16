import { getUser, logoutUser } from '../features/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

interface User {
    email: string
    avatar: string
    id: string
}

export const AuthContext = createContext<{
    user: User | null
    loading: boolean
    logout: () => void
}>({
    user: null,
    loading: true,
    logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const { mutateAsync } = useMutation({ mutationFn: logoutUser })
    const { data, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
    })

    const logout = useCallback(async () => {
        try {
            console.info('Attemping to log the user out')
            await mutateAsync()

            setUser(null)
            console.info('Redirecting to the login page...')
            window.location.replace('/auth/login')
        } catch (e) {
            console.error(e)
        }
    }, [mutateAsync])

    useEffect(() => {
        try {
            if (!user && !isLoading) {
                console.info('Attemping 1 to log the user in')
                const user = data?.payload
                console.info('Attemping 2 to log the user in')
                setUser(user)
                console.info('Attemping 3 to log the user in')
                console.info(`The user ${user?.id} is logged in`)
            }
        } catch (e) {
            console.error('test', e)
        }
    }, [user, loading: isLoading, data])

    const value = useMemo(
        () => ({
            user,
            loading: isLoading,
            logout,
        }),
        [user, loading, logout]
    )
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
