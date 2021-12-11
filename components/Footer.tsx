import React from 'react'
import { IoLogoDiscord } from 'react-icons/io5'
import { Flex, HStack, Link, Text, useColorMode } from '@chakra-ui/react'

const links = {
  github: `https://github.com/bkenio/reef/commit/${process.env.NEXT_PUBLIC_GIT_SHA}`,
  discord: 'https://discord.gg/CYAWQKbbVd',
  statusPage: 'https://bken.statuspage.io',
}

export default function Footer() {
  const { colorMode } = useColorMode()

  const colors = {
    text1: colorMode === 'dark' ? 'gray.400' : 'gray.700',
    text2: colorMode === 'dark' ? 'gray.500' : 'gray.800',
  }

  return (
    <Flex h='auto' w='100%' justify='space-between' align='center'>
      <Flex direction='column' w='100px'>
        <Text fontSize='.7rem' color={colors.text1}>
          {`Terms`}
        </Text>
        <Text fontSize='.6rem' color={colors.text1}>
          <Link href={links.github}>{process.env.NEXT_PUBLIC_GIT_SHA}</Link>
        </Text>
      </Flex>

      <Flex>
        <HStack>
          <Link href={links.discord}>
            <Flex justify='center' align='center'>
              <IoLogoDiscord size='20' />
            </Flex>
          </Link>
        </HStack>
      </Flex>

      <Flex w='100px' justify='end'>
        <HStack>
          <Text fontSize='.7rem' color={colors.text1}>
            <Link href={links.statusPage}>Status</Link>
          </Text>
        </HStack>
      </Flex>
    </Flex>
  )
}
