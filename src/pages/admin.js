import useSWR from 'swr';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Avatar,
  Link,
  Button,
  Flex,
  IconButton,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Progress,
  MenuItem,
} from '@chakra-ui/react';
import moment from 'moment';
import { useSession, } from 'next-auth/client';
import Layout from '../components/Layout';
import videoDuration from '../utils/videoDuration';
import { IoArrowDown, IoSettingsOutline, } from 'react-icons/io5';
import axios from 'axios';

export default function Admin() {
  const [session, loading] = useSession();
  const { data: videos = [] } = useSWR('/api/videos?visibility=all');

  if (loading) return null;
  if ((!loading && !session) || !session?.user?.isAdmin) {
    return (
      <Layout>
        <Text>
          You must be an admin to view this page
        </Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex w='100%' align='center' direction='column'>
        <Box my='4'>
          <Menu>
            <MenuButton as={IconButton} variant='outline' icon={<IoSettingsOutline />}>
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem>
                Reprocess All Videos
              </MenuItem>
              <MenuItem>
                Reprocess All Thumbnails
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Table variant='simple' size='sm' maxW='900px'>
          <TableCaption> All Videos </TableCaption>
          <Thead>
            <Tr>
              <Th>Thumbnail</Th>
              <Th>Video</Th>
              <Th>User</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {videos.map((v) => (
              <Tr key={v.id}>
                <Td>
                  <Box
                    roundedTop='md'
                    h='50px'
                    w='100px'
                    position='relative'
                    bgImage={v.thumbnail}
                    bgSize='cover'
                    bgColor='black'
                    bgPosition='center'
                    bgRepeat='no-repeat'
                  >
                    <Flex
                      position='absolute'
                      right='0'
                      bottom='0'
                      justify='center'
                      align='center'
                      bg='rgba(10, 10, 10, .4)'
                      borderRadius='md'
                      px='1'
                    >
                      <Text color='gray.100' fontSize='xs' fontWeight='bold'>
                        {videoDuration(v.duration)}
                      </Text>
                    </Flex>
                  </Box>
                  <Progress maxW='100px' colorScheme='green' size='xs' value={v.percentCompleted}/>
                </Td>
                <Td>
                  <Link href={`/v/${v.id}`}>
                    <Text fontWeight='bold' overflow='clip'>{v.title}</Text>
                  </Link>
                  <Text>{v.id}</Text>
                </Td>
                <Td>
                  <Flex>
                    <Avatar
                      size='xs'
                      name={v.user.name}
                      src={v.user.image}
                    />
                    <Flex direction='column' ml='2'>
                      <Text fontWeight='bold'>{v.user.name}</Text>
                      <Text fontSize='xs'>{v.user.id}</Text>
                      <Text fontSize='xs'>{moment(v.createdAt).fromNow()}</Text>
                    </Flex>
                  </Flex>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton size='xs' as={Button} rightIcon={<IoArrowDown />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        id={v.id}
                        onClick={async () => {
                          await axios.post(`/api/videos/${v.id}`).catch((error) => {
                            console.error(error);
                          });
                        }}
                      >
                        Reprocess Video
                      </MenuItem>
                      <MenuItem
                        id={v.id}
                        onClick={async () => {
                          await axios.post(`/api/videos/${v.id}/thumbnail`).catch((error) => {
                            console.error(error);
                          });
                        }}
                      >
                        Reprocess Thumbnail
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Layout>
  );
}