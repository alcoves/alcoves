import { Box, Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { listUserAssets } from '../../features/api'
import AssetGrid from '../../components/assetGrid'

export default function LandingRoute() {
  const { data, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: listUserAssets,
  })

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    )
  }

  return (
    <Box>
      <AssetGrid assets={data?.payload} />
    </Box>
  )
}
