import useSWRMutation from 'swr/mutation'

import { useSWRConfig } from 'swr'
import { createRequest } from '../../lib/api'
import { IconButton } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { IoTrashBinSharp } from 'react-icons/io5'

export default function DeleteAsset({
  assetId,
  to,
}: {
  assetId: string
  to?: string
}) {
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const deleteAsset = createRequest('DELETE')
  const { trigger } = useSWRMutation(`/api/assets/${assetId}`, deleteAsset)

  async function handleDelete() {
    await trigger()
    await mutate(`/api/assets`)
    if (to) navigate(to)
  }

  return (
    <IconButton
      variant="solid"
      colorScheme="red"
      onClick={handleDelete}
      aria-label="delete-asset"
      icon={<IoTrashBinSharp />}
    />
  )
}
