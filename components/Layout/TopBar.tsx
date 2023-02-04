import Image from 'next/image'

function Avatar() {
  const loggedIn = false

  if (!loggedIn) {
    return (
      <div className='relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 m-2'>
        <svg
          className='absolute w-10 h-10 text-gray-400 -left-1'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fill-rule='evenodd'
            d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
            clip-rule='evenodd'
          ></path>
        </svg>
      </div>
    )
  }

  return (
    <Image
      alt='avatar'
      width={10}
      className='rounded-full'
      src='/docs/images/people/profile-picture-5.jpg'
    />
  )
}

export default function TopBar() {
  return (
    <div className='flex w-full justify-end h-14'>
      <Avatar />
    </div>
  )
}
