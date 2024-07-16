import { useContext } from 'react'
import { AuthContext } from '../context/authProvider'

export const useAuth = () => {
    return useContext(AuthContext)
}
