import { Button, IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { IoBook } from 'react-icons/io5'

export default function LibraryButton({ expanded }: { expanded: boolean }) {
  const router = useRouter()

  if (expanded) {
    return (
      <Button onClick={() => router.push('/')} w='100%' leftIcon={<IoBook />}>
        Library
      </Button>
    )
  }

  return (
    <IconButton aria-label='library' onClick={() => router.push('/')} w='100%' icon={<IoBook />} />
  )
}
