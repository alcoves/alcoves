import PodsList from './PodsList'
import CreatePod from './Pods/CreatePod'
import { useRouter } from 'next/router'
import { Button, Flex, Heading, useMediaQuery, VStack } from '@chakra-ui/react'
import { IoMenu } from 'react-icons/io5'
import { useContext, useEffect, useState } from 'react'
import AvatarMenu from './AvatarMenu'
import { UserContext } from '../contexts/user'
import Upload from './Upload'

export default function Sidebar() {
  const { user } = useContext(UserContext)
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const [menuWidth, setMenuWith] = useState('220px')
  const { push } = useRouter()

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
      <VStack spacing='4'>
        <Flex w='100%' align='center' justifyContent={justify} onClick={toggleResize}>
          <Button
            justifyContent={justify}
            w='100%'
            maxW='52px'
            onClick={toggleResize}
            aria-label='home'
          >
            <IoMenu />
          </Button>
          {expanded && (
            <Heading pl='3' size='sm' onClick={() => push('/')}>
              Home
            </Heading>
          )}
        </Flex>
        <Flex w='100%' pb='2'>
          <Upload expanded={expanded} />
        </Flex>
        <PodsList expanded={expanded} />
        <CreatePod />
      </VStack>
      <Flex w='100%' justify='flex-start'>
        <Flex w='100%' justifyContent={justify} align='center'>
          <AvatarMenu />
          {expanded && (
            <Flex py='1' pl='2'>
              <Heading size='xs'>{user?.username}</Heading>
            </Flex>
          )}

          {/* <Flex cursor='pointer' onClick={toggleColorMode} justify='center' mx='2'>
          {colorMode === 'dark' ? <IoMoon /> : <IoSunny />}
        </Flex> */}
        </Flex>
      </Flex>
    </Flex>
  )
}
