import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import useLazyRequest from '../../hooks/useLazyRequest'
import { getAPIUrl } from '../../utils/urls'

export default function CreatePod() {
  const router = useRouter()
  const [request, { data, loading }] = useLazyRequest()

  function handleClick() {
    request({
      method: 'POST',
      url: `${getAPIUrl()}/pods`,
    })
  }

  useEffect(() => {
    if (data) {
      router.push(`/pods/${data.pod.id}`)
    }
  }, [data, router])

  return (
    <Button size='sm' isLoading={loading} onClick={handleClick}>
      Create
    </Button>
  )
}
