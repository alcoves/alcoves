import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { UserContext } from '../contexts/user'

export default function Index() {
  const router = useRouter()
  const { loading, authenticated } = useContext(UserContext)

  if (!loading && !authenticated) {
    // TODO :: Splash page here
    router.push('/login')
    return null
  }

  return <Layout>This should be the My Bken component</Layout>
}
