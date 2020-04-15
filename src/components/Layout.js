import Head from "next/head"
import Navigation from './Navigation';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>bken.io</title>
      </Head>
      {children}
    </div>
  )
}