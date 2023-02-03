import './globals.css'
import { Inter } from '@next/font/google'
import TopBar from '../components/Layout/TopBar'
import SideBar from '../components/Layout/SideBar'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body className='bg-gray-200 dark:bg-gray-900 min-h-full h-full'>
        <div className={inter.className} />
        <div className='flex flex-col h-screen'>
          <TopBar />
          <div className='flex h-full'>
            <SideBar />
            <div>{children}</div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
