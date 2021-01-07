import styled from 'styled-components';
import { Box, Text, } from 'grommet';
import { useRouter, } from 'next/router';
import UserCard from './UserCard';
import videoDuration from '../../utils/videoDuration';
import VideoMeta from './VideoMeta';

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
`;

function VideoCard({ v, noUser }) {
  const router = useRouter();

  return (
    <Box>
      <Box onClick={() => router.push(`/v/${v.id}`)}>
        <VideoThumbnailBox v={v}>
          <Duration>
            <Text size='xsmall'>
              {videoDuration(v.duration)}
            </Text>
          </Duration>
        </VideoThumbnailBox>
      </Box>
      {noUser ? <VideoMeta v={v} /> : <UserCard v={v} />}
    </Box>
  );
}

const VideoGridWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

export default function VideoGrid({ videos, noUser }) {
  return (
    <VideoGridWrapper>
      {videos.map((v) => <VideoCard key={v.id} v={v} noUser={noUser} />)}
    </VideoGridWrapper>
  );
}