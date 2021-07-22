import { useSession, } from 'next-auth/client';
import { Flex, Avatar, VStack, SkeletonCircle, Heading, SkeletonText, Text, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import prettyBytes from 'pretty-bytes';
import useSWR from 'swr';

export default function Account() {
  const [session, loadingSession] = useSession();
  const { data } = useSWR(Boolean(session?.id) ? `/api/users/${session?.id}/account` : null);

  return (
    <Layout>
      <Flex justify='center' pt='5' direction='row'>
        <Flex direction='column' rounded='lg' p='5' minW='400px'>
          <Flex direction='row' justify='center' w='100%' h='75px'>
            <SkeletonCircle w='60px' h='60px' isLoaded={Boolean(!loadingSession && session?.user?.image)}>
              <Avatar
                w='60px' h='60px'
                name={session?.user?.name}
                src={session?.user?.image}
              />
            </SkeletonCircle>
            <SkeletonText
              ml='5' w='100%' noOfLines={3} spacing={3}
              isLoaded={Boolean(!loadingSession && session?.user?.name)}
            >
              <Heading size='sm'>
                {session?.user?.name}
                {session?.user?.isAdmin && ' (Admin)'}
              </Heading>
              <Text fontSize='.85rem'>{session?.user?.email}</Text>
              <Text fontSize='.85rem'>User ID: {session?.id}</Text>
            </SkeletonText>
          </Flex>
          <SkeletonText
            w='100%' noOfLines={4} spacing={7}
            isLoaded={Boolean(data)}
          >
            <VStack w='100%'>
              <Flex alignItems='center' justifyContent='space-between' w='100%'>
                <Text>Videos Uploaded</Text>
                <Text>{data?.totalVideos}</Text>
              </Flex>
              <Flex alignItems='center' justifyContent='space-between' w='100%'>
                <Text>Hours Uploaded</Text>
                <Text>{(data?.totalDuration / 3600).toFixed(2)}</Text>
              </Flex>
              <Flex alignItems='center' justifyContent='space-between' w='100%'>
                <Text>Video Views</Text>
                <Text>{data?.totalViews}</Text>
              </Flex>
              <Flex alignItems='center' justifyContent='space-between' w='100%'>
                <Text>Data Stored</Text>
                <Text>{prettyBytes(data?.totalBytesStored || 0)}</Text>
              </Flex>
            </VStack>
          </SkeletonText>
        </Flex>
      </Flex>
    </Layout>
  );
}