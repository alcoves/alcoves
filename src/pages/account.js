import { useSession, signOut, } from 'next-auth/client';
import { IoSunnyOutline, IoSunny, } from 'react-icons/io5';
import { Flex, IconButton, CircularProgress, useColorMode, } from '@chakra-ui/react';
import Layout from '../components/Layout';

export default function Account() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [session, loading] = useSession();

  if (loading) {
    return (
      <Layout>
        <div className='flex w-full justify-center pt-4'>
          <CircularProgress isIndeterminate />
        </div>
      </Layout>
    );
  }

  if (session) {
    return (
      <Layout>
        <div className='flex flex-col pt-4'>
          <div width='500px' align='center' margin='medium'>
            <img className='h-32 w-32 rounded-full' src={session.user.image} alt='avatar' />
            <h4 className='mt-2 text-3xl font-bold text-gray-200'>
              {session.user.name}
            </h4>
            <p className='mb-2 text-sm lowercase font-bold text-gray-500'>
              {session.user.email}
            </p>
            <p className='mb-2 text-sm lowercase font-bold text-gray-500'>
              User ID: {session.id}
            </p>
          </div>
          <Flex cursor='pointer' justifyContent='center'>
            <IconButton
              size='sm'
              mx='5px'
              variant='ghost'
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? <IoSunny size='1.5rem'/> : <IoSunnyOutline size='1.5rem'/>}
            />
          </Flex>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex flex-col pt-4'>
        <div width='500px' align='center' margin='medium'>
          <div className='text-gray-200 uppercase text-3xl font-extrabold h-8 py-1 px-2 tracking-wide'>
            Please sign in
          </div>
        </div>
      </div>
    </Layout>
  );
}