import Upload from './Upload'
import { useContext } from 'react'
import { Wrap } from '@chakra-ui/react'
import { UploadsContext } from '../contexts/uploads'

export default function UploadList() {
  const { uploads } = useContext(UploadsContext)

  return (
    <Wrap spacing='4' my='1'>
      {Object.entries(uploads).map(([k, v]) => {
        return <Upload key={k} upload={v} />
      })}
    </Wrap>
  )
}
