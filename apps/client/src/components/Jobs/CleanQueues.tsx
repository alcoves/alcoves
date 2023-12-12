import useSWRMutation from 'swr/mutation'

import { Button } from '@chakra-ui/react'
import { mutate } from 'swr'
import { createRequest } from '../../lib/api'

export default function CleanQueues() {
  const cleanQueueRequest = createRequest('POST')
  const { trigger } = useSWRMutation(`/api/jobs/clean`, cleanQueueRequest)

  async function cleanQueues() {
    await trigger()
    await mutate(`/api/jobs`)
  }

  return <Button onClick={cleanQueues}>Clean Queues</Button>
}
