import { useContext, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Heading, Box, Text, } from 'grommet';
import moment from 'moment';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import { Context, } from '../../utils/store';
import { useApiLazy, } from '../../utils/api';
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
  height: 24px;
  position: absolute;
  margin: 0px 0px 5px 5px;
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
            <div
              key={v.id}
              className='flex flex-col content-start p-2'
            >
              <VideoThumbnailBox v={v} onClick={() => router.push(`/studio/${v.id}`)}>
                <Duration>
                  <Text size='xsmall'>
                    {videoDuration(v.duration)}
                  </Text>
                </Duration>
                <Visibility>
                  {v.visibility === 'public' ? (
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24px 24px' stroke='green'>
                      <path
                        strokeLinecap='round' 
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round' 
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  ) : (
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24px 24px' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2} 
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      />
                    </svg>
                  )}
                </Visibility>
              </VideoThumbnailBox>
              <div className='overflow-ellipsis truncate flex flex-row content-center'>
                <h5>
                  {v.title}
                </h5>
              </div>
              <div direction='flex flex-row'>
                <p className='text-xs'>
                  {metadata(v)}
                </p>
              </div>
            </div>
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