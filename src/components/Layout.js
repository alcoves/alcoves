import Head from "next/head"
import Navigation from "./Navigation"

export default function Layout(props) {
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