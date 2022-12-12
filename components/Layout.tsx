import React from 'react'
import { Flex } from '@chakra-ui/react'

export default function Layout(props) {
  return (
    <Flex p='4' align='start' justify='center' border='solid blue 2px'>
      {props.children}
    </Flex>
  )
}
