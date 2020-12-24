import { useContext, } from 'react';
import { Avatar, Box, Button, Heading, Text, } from 'grommet';
import { useRouter, } from 'next/router';
import Layout from '../components/Layout';
import { Context, } from '../utils/store';
import Spinner from '../components/Spinner';

export default function Account() {
  const router = useRouter();
  const { logout, user, authenticated, loading } = useContext(Context);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  
  if (!authenticated) {
    return (
      <Layout>
        Please log in
      </Layout>
    );
  }

  return (
    <Layout>
      <Box align='center'>
        <Box width='500px' align='center' margin='medium'>
          <Avatar size='xlarge' src={user.avatar} />
          <Heading level='4'>
            {user.username}
          </Heading>
          <Text>
            {user.email}
          </Text>
          <Button
            primary
            margin='small'
            label='Log out'
            onClick={() => {
              logout();
              router.push('/');
            }}
          />
        </Box>
      </Box>
    </Layout>
  );
}