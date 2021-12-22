import { Box } from '@chakra-ui/react'
import { useContext } from 'react'
import { UploadsContext } from '../contexts/uploads'

export default function UploadList() {
  const { uploads } = useContext(UploadsContext)

  return (
    <Box>
      {uploads.map(u => {
        return (
          <Box key={u.status}>
            <Box> Here is the upload </Box>
            <pre>{JSON.stringify(u)}</pre>
          </Box>
        )
      })}
    </Box>
  )
}
