import { Button, Flex, Heading, Box } from '@chakra-ui/react'
import Image from 'next/image'
import { providers as getProviders, signIn } from 'next-auth/client'

export default function Login({ providers }) {
  return (
    <Flex justify='center'>
      <Flex align='center' pt='10vh' direction='column'>
        <Image height='180px' width='200px' src='/favicon.ico' alt='logo' />
        <Heading>Dive into bken</Heading>
        {Object.values(providers).map(provider => (
          <Box key={provider.name} w='full'>
            <Button my='2' isFullWidth onClick={() => signIn(provider.id)}>
              Log in with {provider.name}
            </Button>
          </Box>
        ))}
      </Flex>
    </Flex>
  )
}

export async function getServerSideProps(ctx) {
  return { props: { providers: await getProviders(ctx) } }
}
