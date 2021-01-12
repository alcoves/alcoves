import { useContext, } from 'react';
import Image from 'next/image';
import { useRouter, } from 'next/router';
import { Context, } from '../utils/store';

export default function Navigation() {
  const router = useRouter();
  const { user, authenticated } = useContext(Context);

  return (
    <div className='flex flex-row h-12 justify-between bg-gray-900'>
      <div className='h-12 w-12 flex flex-row justify-center items-center'>
        <div style={{ cursor: 'pointer', marginLeft: '10px' }}>
          <Image
            alt='logo'
            width={40}
            height={40}
            src='/logo.png'
            onClick={() => router.push('/')}
          />
        </div>
      </div>
      <div
        className='flex flex-row items-center justify-end'
      >
        {authenticated && user ? (
          <>
            <svg
              onClick={() => router.push('/upload')} 
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              className='cursor-pointer h-6 w-6'
              stroke='white'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
              />
            </svg>
            {/* <img className='h-8 w-8' src={user.avatar} alt='avatar' /> */}
            <select
              id='home-menu'
              name='home-menu'
              onClick={(e) => router.push(e.target.value)}
              className='mx-2 text-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 rounded-md bg-gray-800 text-white h-6'
            >
              <option value={`/u/${user.id}`}> Profile </option>
              <option value='/studio'> Studio </option>
              <option value='/account'> Account </option>
            </select>
          </>
        )
          : (
            <svg
              onClick={() => router.push('/login')} 
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              className='cursor-pointer h-6 w-6'
              stroke='white'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          )}
      </div>
    </div>
  );
}