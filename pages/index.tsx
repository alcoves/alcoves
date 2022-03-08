import React from 'react'

import Landing from '../components/Landing'
import Layout from '../components/Layout'
import Library from '../components/Library'
import useUser from '../hooks/useUser'

export default function Index() {
  const { user, loading } = useUser()
  console.log(user, loading)

  if (loading) return null
  if (user) {
    return (
      <Layout>
        <Library />
      </Layout>
    )
  } else {
    return <Landing />
  }
}
