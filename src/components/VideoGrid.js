import styled from 'styled-components';
import { Box, Text, } from 'grommet';
import { useRouter, } from 'next/router';
import UserVideoCard from './UserVideoCard';
import videoDuration from '../utils/videoDuration';

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

function VideoCard({ v }) {
  const router = useRouter();

  return (
    <Box>
      <div onClick={() => router.push(`/v/${v.id}`)}>
        <div
          style={{
            width: '100%',
            cursor: 'pointer',
            minHeight: '180px',
            maxHeight: '180px',
            position: 'relative',
            borderRadius: '4px',
            backgroundColor: 'grey',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url("${v.thumbnail}")`,
          }}
        >
          <Duration>
            <Text size='xsmall'>
              {videoDuration(v.duration)}
            </Text>
          </Duration>
        </div>
      </div>
      <Box pad='small'>
        <UserVideoCard v={v} />
      </Box>
    </Box>
  );
}

const VideoGridWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

export default function VideoGrid({ videos }) {
  return (
    <VideoGridWrapper>
      {videos.map((v) => <VideoCard key={v.id} v={v} />)}
    </VideoGridWrapper>
  );
}