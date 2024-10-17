import { useAuth } from '../hooks/useAuth'
import { Image, IconButton } from '@chakra-ui/react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function UserAccountMenuButton() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <NavLink to="/profile">
      <IconButton
        size="sm"
        aria-label="user"
        onClick={() => navigate('/profile')}
        icon={
          <Image
            w="100%"
            h="100%"
            rounded="md"
            src={user?.avatar || '/favicon.ico'}
          />
        }
      />
    </NavLink>
  )
}
