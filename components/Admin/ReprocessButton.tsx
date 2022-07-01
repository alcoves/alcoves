import { Button } from '@chakra-ui/react'

import useLazyRequest from '../../hooks/useLazyRequest'
import { getAPIUrl } from '../../utils/urls'

export default function ReprocessButton({ videoId }: { videoId: string }) {
  const [reprocessVideo, { loading }] = useLazyRequest()

  async function handleReprocess() {
    await reprocessVideo({
      method: 'POST',
      url: `${getAPIUrl()}/admin/videos/${videoId}/reprocess`,
    })
  }

  return (
    <Button size='xs' onClick={handleReprocess} isLoading={loading}>
      Reprocess Video
    </Button>
  )
}
