import useSWRMutation from 'swr/mutation'

import { useSWRConfig } from 'swr'
import { createRequest } from '../../lib/api'
import { IconButton } from '@chakra-ui/react'
import { IoTrashBinOutline } from 'react-icons/io5'

export default function DeleteAsset({ assetId }: { assetId: string }) {
  const { mutate } = useSWRConfig()
  const deleteAsset = createRequest('DELETE')
  const { trigger } = useSWRMutation(`/api/assets/${assetId}`, deleteAsset)

  async function handleDelete() {
    await trigger()
    await mutate(`/api/assets`)
  }

  return (
    <IconButton
      onClick={handleDelete}
      aria-label="delete-asset"
      icon={<IoTrashBinOutline />}
    />
  )
}
