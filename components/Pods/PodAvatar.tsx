import { Avatar } from '@chakra-ui/react'

export default function PodAvatar({ pod }: any) {
  // Select file
  // Create file upload
  // Get signed urls
  // Upload photo
  // API processes photo and stores it
  // Refetch pods

  return (
    <div>
      <Avatar name={pod?.name} src={pod?.image} mr='2' />
    </div>
  )
}
