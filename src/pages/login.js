
export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-black-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <img className='mx-auto h-12 w-auto' src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg' alt='Workflow' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Dive in to bken
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
              Or create your account
            </a>
          </p>
        </div>
        <form className='mt-8 space-y-6' action='#' method='POST'>
          <input type='hidden' name='remember' value='true' />
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email-address' className='sr-only'>Email address</label>
              <input id='email-address' name='email' type='email' autoComplete='email' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Email address' />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>Password</label>
              <input id='password' name='password' type='password' autoComplete='current-password' required className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='Password' />
            </div>
          </div>

          <div className='flex items-center justify-between'>
            {/* <div className='flex items-center'>
              <input id='remember_me' name='remember_me' type='checkbox' className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded' />
              <label htmlFor='remember_me' className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div> */}

            {/* <div className='text-sm'>
              <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
                Forgot your password?
              </a>
            </div> */}
          </div>

          <div>
            <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
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

// import { useContext, useEffect, useState, } from 'react';
// import Link from 'next/link';
// import Router from 'next/router';
// import { Text, Button, Heading, Box, TextInput, } from 'grommet';
// import { useApiLazy, } from '../utils/api';
// import { Context, } from '../utils/store';
// import Bugsnag from '../utils/bugsnag';

// export default function Login() {
//   const { login } = useContext(Context);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const [loginRemote, { data, loading, error }] = useApiLazy('/login', 'post');

//   useEffect(() => {
//     if (data) {
//       login(data.token);
//       Router.push('/');
//     }
//   }, [data]);

//   return (
//     <Box
//       height='100vh'
//       width='100vw'
//       align='start'
//       justify='center'
//       direction='row'
//     >
//       <Box
//         width='450px'
//         display='flex'
//         style={{marginTop: '100px'}}
//         borderRadius='5px'
//         align='center'
//         direction='column'
//         justify='start'
//       >
//         <Box>
//           <Heading
//             level='1'
//             margin='small'
//           >
//             Dive in to Bken
//           </Heading>
//         </Box>
//         <Box
//           width='100%'
//           margin='small'
//           justify='center'
//           alignItems='start'
//         >
//           <TextInput
//             name='email'
//             width='100%'
//             value={email}
//             placeholder='Email'
//             onChange={e => setEmail(e.target.value)}
//           />
//           <br />
//           <TextInput
//             width='100%'
//             type='password'
//             name='password'
//             value={password}
//             placeholder='Password'
//             onChange={e => setPassword(e.target.value)}
//           />
//           <Button
//             style={{ margin: '20px 0px 20px 0px' }}
//             primary
//             label='Log In'
//             fill='horizontal'
//             disabled={loading}
//             onClick={() => {
//               try {
//                 loginRemote({ data: {
//                   email,
//                   password,
//                 }});
//               } catch (e) {
//                 Bugsnag.notify(e);
//               }
//             }}
//           />
//           <Box
//             width='100%'
//             align='center'
//             justify='center'
//             direction='column'
//           >
//             {error && (
//               <Text color='red'>{error.message}</Text>
//             )}
//             <Text as={Link} href='/register'>
//               Register
//             </Text>
//           </Box>
//           <Box />
//         </Box>
//       </Box>
//     </Box>
//   );
// }