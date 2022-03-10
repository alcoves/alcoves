import React from 'react'

import Landing from '../components/Landing'
import Layout from '../components/Layout'
import Library from '../components/Library'
import { userStore } from '../stores/user'

export default function Index() {
  const { user, loading } = userStore()

  if (loading) return null
  if (!user) return <Landing />

  return (
    <Layout>
      <Library />
    </Layout>
  )
}
