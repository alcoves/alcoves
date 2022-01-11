import AvatarMenu from './AvatarMenu'
import UsageQuota from './UsageQuota'
import UploadButton from './UploadButton'
import LibraryButton from './LibraryButton'
import { IoMenu } from 'react-icons/io5'
import { UserContext } from '../contexts/user'
import { useContext, useEffect, useState } from 'react'
import { Flex, Heading, IconButton, useMediaQuery, VStack } from '@chakra-ui/react'

export default function Sidebar() {
  const { user } = useContext(UserContext)
  const [menuWidth, setMenuWith] = useState('220px')
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (isMobile) {
      setMenuWith('70px')
    } else {
      setMenuWith('220px')
    }
  }, [isMobile])

  function toggleResize() {
    if (menuWidth === '220px') {
      setMenuWith('70px')
    } else if (menuWidth === '70px') {
      setMenuWith('220px')
    }
  }

  const justify = menuWidth !== '70px' ? 'flex-start' : 'center'
  const expanded = menuWidth !== '70px' ? true : false

  return (
    <Flex p='2' h='100%' w={menuWidth} minW={menuWidth} direction='column' justify='space-between'>
      <VStack spacing='2'>
        <Flex w='100%' align='center' justifyContent={justify} onClick={toggleResize}>
          <IconButton variant='ghost' w='45px' aria-label='menu' icon={<IoMenu size='20px' />} />
        </Flex>
        <UploadButton expanded={expanded} />
        <LibraryButton expanded={expanded} />
      </VStack>
      <Flex w='100%' justify='flex-start' direction='column'>
        <UsageQuota />
        <Flex w='100%' justifyContent={justify} align='center'>
          <AvatarMenu />
          {expanded && (
            <Flex py='1' pl='2'>
              <Heading size='xs'>{user?.username}</Heading>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
