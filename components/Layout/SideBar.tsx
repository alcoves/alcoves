'use client'

import { useRouter } from 'next/navigation'

export default function SideBar() {
  const router = useRouter()

  const button = 'bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'

  function handleClick(e, href) {
    e.preventDefault()
    router.push(href)
  }

  return (
    <div className='w-40 max-w-40 flex flex-col gap-2'>
      <button className={button} onClick={e => handleClick(e, '/')}>
        Home
      </button>
      <button className={button} onClick={e => handleClick(e, '/archives')}>
        Archives
      </button>
      <button className={button} onClick={e => handleClick(e, '/upload')}>
        Upload
      </button>
    </div>
  )
}
