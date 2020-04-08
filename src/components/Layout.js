import Head from "next/head"
import Navigation from "./Navigation"

import { useUser } from '../data/User';

export default function Layout(props) {
  const user = useUser()
  user.login()
  return (
    <div>
      <Head>
        <title>bken.io</title>
      </Head>
      <Navigation />
      {props.children}
    </div>
  )
}