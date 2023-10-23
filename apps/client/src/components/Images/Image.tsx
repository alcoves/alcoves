import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import useSWR from 'swr'

export default function Image() {
  const { imageId } = useParams()
  const { data, isLoading } = useSWR(`/images/${imageId}`)

  return (
    <Box>
      <Breadcrumb fontWeight="medium" fontSize="lg">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/images">
            Images
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/images/${imageId}`}>
            {imageId}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      Here are some cool image things yo
      {data?.id}
    </Box>
  )
}
