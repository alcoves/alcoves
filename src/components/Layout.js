import NavBar from "./NavBar"
import Head from "next/head"

const Layout = (props) => {
  return (
    <div>
      <Head>
        <title>bken.io</title>
        <NavBar />
        {props.children}
      </Head>
    </div>
  )
}

export default Layout