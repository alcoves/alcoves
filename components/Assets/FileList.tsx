import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export default function FileList({ assets }: { assets: any[] }) {
  const router = useRouter()

  const justFiles = assets.filter((asset) => asset.type === 'file')
  return (
    <>
      <Heading my="2">Files</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Date</Th>
              <Th>Size</Th>
            </Tr>
          </Thead>
          <Tbody>
            {justFiles.map((file) => {
              return (
                <Tr
                  key={file.fullPath}
                  cursor="pointer"
                  _hover={{ bg: 'blue.600' }}
                  onClick={() => {
                    router.push(`${router.asPath}/${file.name}`)
                  }}
                >
                  <Td>{file.name}</Td>
                  <Td>{file.stats.ctime}</Td>
                  <Td>{bytesToSize(file.stats.size)}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
