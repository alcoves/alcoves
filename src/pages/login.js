import { useContext, useEffect, useState, } from 'react';
import Router from 'next/router';
import { useApiLazy, } from '../utils/api';
import { Context, } from '../utils/store';

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
    <div className='min-h-screen flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <img className='mx-auto h-12 w-auto' src='/favicon.ico' alt='Workflow' />
          <h2 className='mt-2 text-center text-5xl font-extrabold text-gray-200'>
            Dive in to bken
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            <a href='/register' className='font-medium  '>
              Or create your account
            </a>
          </p>
        </div>
        <form className='mt-8 space-y-6'>
          <input type='hidden' name='remember' value='true' />
          <div>
            <div>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='appearance-none my-2 rounded-none relative block w-full px-3 py-2 bg-gray-900 text-gray-500 rounded-t-md focus:outline-none'
                placeholder='Email address'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none my-2 rounded-none relative block w-full px-3 py-2 bg-gray-900 text-gray-500 rounded-b-md focus:outline-none'
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }} 
              />
            </div>
          </div>

          {/* <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input id='remember_me' name='remember_me' type='checkbox' className='h-4 w-4 border-gray-300 rounded' />
              <label htmlFor='remember_me' className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div>

           <div className='text-sm'>
              <a href='#' className='font-medium  '>
                Forgot your password?
              </a>
            </div>
          </div> */}

          <div>
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                try {
                  loginRemote({ data: {
                    email,
                    password,
                  }});
                } catch (err) {
                  console.error(err);
                }
              }}
              className='group relative w-full flex justify-center py-2 px-4 text-sm font-semibold  rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 bg-teal-500 uppercase'
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                  <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}