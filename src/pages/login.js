import { useContext, useEffect, useState, } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Text, Button, Heading, Box, TextInput, } from 'grommet';
import { useApiLazy, } from '../utils/api';
import { Context, } from '../utils/store';
import Bugsnag from '../utils/bugsnag';

export default function Login() {
  const { login } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginRemote, { data, loading, error }] = useApiLazy('/login', 'post');

  useEffect(() => {
    if (data) {
      login(data.token);
      Router.push('/');
    }
  }, [data]);

  return (
    <Box
      height='100vh'
      width='100vw'
      align='start'
      justify='center'
      direction='row'
    >
      <Box
        width='450px'
        display='flex'
        style={{marginTop: '100px'}}
        borderRadius='5px'
        align='center'
        direction='column'
        justify='start'
      >
        <Box>
          <Heading
            level='1'
            margin='small'
          >
            Dive in to Bken
          </Heading>
        </Box>
        <Box
          width='100%'
          margin='small'
          justify='center'
          alignItems='start'
        >
          <TextInput
            name='email'
            width='100%'
            value={email}
            placeholder='Email'
            onChange={e => setEmail(e.target.value)}
          />
          <br />
          <TextInput
            width='100%'
            type='password'
            name='password'
            value={password}
            placeholder='Password'
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            style={{ margin: '20px 0px 20px 0px' }}
            primary
            label='Log In'
            fill='horizontal'
            disabled={loading}
            onClick={() => {
              try {
                loginRemote({ data: {
                  email,
                  password,
                }});
              } catch (err) {
                Bugsnag.notify(new Error('failed to log user in'));
              }
            }}
          />
          <Box
            width='100%'
            align='center'
            justify='center'
            direction='column'
          >
            {error && (
              <Text color='red'>{error.message}</Text>
            )}
            <Text as={Link} href='/register'>
              Register
            </Text>
          </Box>
          <Box />
        </Box>
      </Box>
    </Box>
  );
}