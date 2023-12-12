import useSWRMutation from 'swr/mutation'

import { Button } from '@chakra-ui/react'
import { createRequest } from '../../lib/api'

export default function RetryIngest({ assetId }: { assetId: string }) {
  const retryIngest = createRequest('POST')
  const { trigger, isMutating } = useSWRMutation(
    `/api/assets/${assetId}/retry-ingest`,
    retryIngest
  )

  return (
    <Button
      colorScheme="red"
      isLoading={isMutating}
      onClick={() => {
        trigger()
      }}
    >
      Retry Ingest
    </Button>
  )
}
