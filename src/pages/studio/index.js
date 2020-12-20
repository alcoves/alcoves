import { useContext, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Heading, Box, Text, } from 'grommet';
import moment from 'moment';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import { Context, } from '../../utils/store';
import { useApiLazy, } from '../../utils/api';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import videoDuration from '../../utils/videoDuration';

const Duration = styled.div`
  right: 0;
  bottom: 0;
  z-index: 0;
  color: white;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  border-radius: 3px;
  margin: 0px 3px 3px 0px;
  padding: 0px 3px 0px 3px;
  background: rgba(0, 0, 0, 0.7);
`;

const Visibility = styled.div`
  left: 0;
  bottom: 0;
  z-index: 0;
  height: 35px;
  position: absolute;
  margin: 3px 0px 0px 3px;
`;

const VideoGridWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const VideoThumbnailBox = styled.div`
  width: 100%;
  cursor: pointer;
  min-height: 180px;
  max-height: 180px;
  position: relative;
  border-radius: 4px;
  background-color: grey;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("${p => p.v.thumbnail}");
  -webkit-box-shadow: inset 0px -105px 66px -39px rgba(0,0,0,0.83);
  -moz-box-shadow: inset 0px -105px 66px -39px rgba(0,0,0,0.83);
  box-shadow: inset 0px -105px 66px -39px rgba(0,0,0,0.83);
`;

export default function studio() {
  const router = useRouter();
  const [getVideos, { data }] = useApiLazy();
  const { user, authenticated, loading } = useContext(Context);

  useEffect(() => {
    if (user && user.id) {
      getVideos({ url: `/videos?userId=${user.id}&visibility=all` });
    }
  }, [user]);

  function metadata(v) {
    const createdAt = moment(v.createdAt).fromNow();
    return (
      `Created ${createdAt} · ${v.views} Views`
    );
  }

  if (data) {
    return (
      <Layout>
        <VideoGridWrapper>
          {data.map(v => (
            <Box
              key={v.id}
              pad='small'
              align='start'
              direciton='column'
            >
              <VideoThumbnailBox v={v} onClick={() => router.push(`/studio/${v.id}`)}>
                <Duration>
                  <Text size='xsmall'>
                    {videoDuration(v.duration)}
                  </Text>
                </Duration>
                <Visibility>
                  {v.visibility === 'public' ? (
                    <Icon
                      width='20px'
                      height='20px'
                      name='eye'
                      color='#00796B'
                    />
                  ) : (
                    <Icon
                      width='20px'
                      height='20px'
                      name='eye-off'
                      color='#78909C'
                    />
                  )}
                </Visibility>
              </VideoThumbnailBox>
              <Box direction='row' align='center' height='40px'>
                <Heading margin='none' level='5' truncate>
                  {v.title}
                </Heading>
              </Box>
              <Box direction='row'>
                <Text size='xsmall'>
                  {metadata(v)}
                </Text>
              </Box>
            </Box>
          ))}
        </VideoGridWrapper>
      </Layout>
    );
  }

  if (!loading && !authenticated) {
    return (
      <Layout>
        <Box margin='small' align='center'>
          <Heading size='xsmall'>
            You must be authenticated
          </Heading>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box margin='small' align='center'>
        <Spinner />
      </Box>
    </Layout>
  );
}