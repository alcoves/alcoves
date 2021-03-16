import { useState, } from 'react';
import Image from 'next/image';
import { useRouter, } from 'next/router';
import { useSession } from 'next-auth/client'

export default function Navigation() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, loading] = useSession();

  function handleClick(route) {
    setOpen(false);
    router.push(route);
  }

  function renderRightNav() {
    if (loading) {
      return (
        <>
        </>
      );
    } if (!loading && session && session.user) {
      return(
        <>
          <svg
            onClick={() => router.push('/upload')} 
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            className='cursor-pointer h-6 w-6'
            stroke='white'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
            />
          </svg>
          <img
            alt='image'
            src={session.user.image}
            onClick={() => setOpen(!open)}
            className='h-8 w-8 mx-2 rounded-full cursor-pointer'
          />
          {open && (
            <div className='z-50 absolute right-0 top-0 mt-14 mr-4 w-56 rounded-md shadow-lg bg-gray-900'>
              <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
                <div
                  onClick={() => handleClick(`/u/${session.user.name}`)} 
                  className='cursor-pointer block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800'
                >
                  Profile
                </div>
                <div
                  onClick={() => handleClick('/studio')} 
                  className='cursor-pointer block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800'
                >
                  Studio
                </div>
                <div
                  onClick={() => handleClick('/account')} 
                  className='cursor-pointer block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800'
                >
                  Account
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  }

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
      <div className='flex flex-row items-center justify-end'>
        {renderRightNav()}
      </div>
    </div>
  );
}