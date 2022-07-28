import { Flex, List, ListItem, Text, useColorMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function CustomListItem(props: any) {
  const router = useRouter()
  const { colorMode } = useColorMode()
  const isSelected = router.pathname === props.url

  function getBgColor() {
    if (colorMode === 'dark') {
      return isSelected ? 'rgba(49, 151, 149, .2)' : 'transparent'
    } else {
      return isSelected ? 'teal.50' : 'transparent'
    }
  }

  function handleClick() {
    router.push(props.url)
  }

  return (
    <ListItem cursor='pointer' onClick={handleClick} px='2' bg={getBgColor()} rounded='md'>
      <Text py='2' pl='1' fontWeight={isSelected ? 'bold' : ''}>
        {props.children}
      </Text>
    </ListItem>
  )
}

export default function SidebarMenu() {
  return (
    <Flex h='100%' w='100%' direction='column' justify='space-between'>
      <List spacing={2} p='4'>
        <CustomListItem url='/'>Library</CustomListItem>
      </List>
      <Flex justify='center' pb='4'>
        <Text fontSize='.7rem'>Terms</Text>
      </Flex>
    </Flex>
  )
}
