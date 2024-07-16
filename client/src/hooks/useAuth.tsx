import { useContext } from 'react'
import { AuthContext } from '../app/authProvider'

export const useAuth = () => {
    return useContext(AuthContext)
}
