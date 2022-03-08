import React from 'react'

import Landing from '../components/Landing'
import Layout from '../components/Layout'
import Library from '../components/Library'
import useUser from '../hooks/useUser'

export default function Index() {
  const { user, loading } = useUser()

  if (loading) return null
  if (!user) return <Landing />

  return (
    <Layout>
      <Library />
    </Layout>
  )
}
