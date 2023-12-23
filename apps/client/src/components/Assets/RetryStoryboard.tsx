import useSWRMutation from 'swr/mutation'

import { Button } from '@chakra-ui/react'
import { createRequest } from '../../lib/api'

export default function RetryStoryboard({ assetId }: { assetId: string }) {
  const request = createRequest('POST')
  const { trigger, isMutating } = useSWRMutation(
    `/api/assets/${assetId}/retry-storyboard`,
    request
  )

  return (
    <Button
      colorScheme="red"
      isLoading={isMutating}
      onClick={() => {
        trigger()
      }}
    >
      Retry Storyboard
    </Button>
  )
}
