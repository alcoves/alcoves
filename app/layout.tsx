import './globals.css'
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body className={inter.className}>
        <div className='bg-gray-200 dark:bg-gray-900 h-screen w-screen'>{children}</div>
      </body>
    </html>
  )
}
