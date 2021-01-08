import { Box, Avatar, Heading, Text, } from 'grommet';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import VideoGrid from '../../components/VideoGrid/Index';
import { useApi, } from '../../utils/api';

function countViews(videos) {
  return videos.reduce((acc, cv) => {
    acc += cv.views;
    return acc;
  }, 0);
}

const HeaderImage = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("${p => p.src}");
`;

function UserProfile({ uid }) {
  const { data: user } = useApi(`/users/${uid}`);
  const { data: videos } = useApi(`/videos?userId=${uid}`);

  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Layout>
        <Box direction='column'>
          <HeaderImage src='https://images.unsplash.com/photo-1609771270965-aeda41eee819?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' />
          <Box direction='column' pad='small' gap='small'>
            <Box direction='row' gap='small' margin='small'>
              {user && videos && (
                <Box direction='row' gap='small'>
                  <Avatar
                    size='xlarge'
                    src={user.avatar}
                  />
                  <Box direction='column' justify='between'>
                    <Heading level='3' margin='none'>{user.username}</Heading>
                    <Box>
                      <Text size='small'>{`Public Videos: ${videos.length}`}</Text>
                      <Text size='small'>{`Total Views: ${countViews(videos)}`}</Text>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box>
              {videos && <VideoGrid videos={videos} noUser />}
            </Box>
          </Box>
        </Box>
      </Layout>
    </>
  );
}

export default function UserProfileIndex() {
  const router = useRouter();
  const { uid } = router.query;
  if (!uid) return <div />;
  return <UserProfile uid={uid} />;
}
