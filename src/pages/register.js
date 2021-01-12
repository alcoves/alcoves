import { useContext, useEffect, useState, } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { useApiLazy, } from '../utils/api';
import { Context, } from '../utils/store';

export default function Register() {
  const { login } = useContext(Context);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [registerRemote, { data, error }] = useApiLazy('/register', 'post');

  useEffect(() => {
    if (data) {
      login(data.token);
      Router.push('/');
    }
  }, [data]);

  return (
    <div
      height='100vh'
      width='100vw'
      align='start'
      justify='center'
      direction='row'
    >
      <div
        width='450px'
        display='flex'
        style={{marginTop: '100px'}}
        borderRadius='5px'
        align='center'
        direction='column'
        justify='start'
      >
        <div>
          <h1
            level='2'
            margin='small'
          >
            Create Your Account
          </h1>
        </div>
        <div
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
            name='username'
            value={username}
            placeholder='Username'
            onChange={e => setUsername(e.target.value)}
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
          <br />
          <TextInput
            width='100%'
            type='password'
            name='confirmPassword'
            value={cPassword}
            placeholder='Confirm Password'
            onChange={e => setCPassword(e.target.value)}
          />
          {error && (
            <div
              width='100%'
              padding='10px'
              display='flex'
              justifyContent='center'
            >
              <h1 color='red' size={200}>{error.message}</h1>
            </div>
          )}
          <Button
            style={{ margin: '20px 0px 20px 0px' }}
            primary
            disabled
            fill='horizontal'
            label='Registration is currently disabled'
            onClick={() => {
              registerRemote({
                data: { email, password },
              });
            }}
          />
          <div
            width='100%'
            align='center'
            justify='center'
            direction='column'
          >
            {error && (
              <p color='red'>{error.message}</p>
            )}
            <p as={Link} href='/login'>
              Login
            </p>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}