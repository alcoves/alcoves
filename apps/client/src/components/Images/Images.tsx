import useSWR from 'swr'
import {
  Box,
  Heading,
  Image,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Flex,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { cdnURL } from '../../lib/cdn'

export default function ImagesPage() {
  const { data, isLoading } = useSWR('/images')

  const bg = useColorModeValue('gray.100', 'gray.700')
  return (
    <Box>
      <Heading size="lg">Images</Heading>
      {!isLoading && data && (
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>ID</Th>
                <Th isNumeric>Created</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((image: any) => {
                const imageUrl = cdnURL(
                  `images/${image.id}.avif?q=50&w=100&h=100`
                )
                return (
                  <Tr key={image.id} _hover={{ bg }} cursor="pointer">
                    <Td w="100px" minW="100px">
                      <Image
                        boxSize="50px"
                        rounded="sm"
                        src={imageUrl}
                        alt={image.id}
                      />
                    </Td>
                    <Td>
                      <Text fontSize=".8em">{image.id}</Text>
                    </Td>
                    <Td isNumeric>
                      <Box>
                        {DateTime.fromISO(image?.createdAt).toFormat(
                          'MM/dd/yy hh:mm a'
                        )}
                      </Box>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Flex p="2" justify="center">
        <Text>{`${data?.length} Images`}</Text>
      </Flex>
    </Box>
  )
}
