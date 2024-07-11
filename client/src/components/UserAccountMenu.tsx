import { Image, IconButton } from '@chakra-ui/react'

import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function UserAccountMenuButton() {
    const navigate = useNavigate()
    const { user } = useAuth()

    return (
        <IconButton
            size="sm"
            aria-label="user"
            onClick={() => navigate('/profile')}
            icon={<Image src={user?.avatar || '/favicon.ico'} />}
        />
    )
}
