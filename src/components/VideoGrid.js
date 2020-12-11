import { Heading, Pane, } from 'evergreen-ui';
import Link from 'next/link';
import styled from 'styled-components';
import videoDuration from '../utils/videoDuration';
import UserVideoCard from './UserVideoCard';

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
  return (
    <Pane
      width='100%'
      elevation={1}
      borderRadius='5px'
      background='tint2'
    >
      <Link href={`/v/${v.id}`}>
        <div
          style={{
            width: '100%',
            cursor: 'pointer',
            minHeight: '180px',
            maxHeight: '180px',
            position: 'relative',
            backgroundColor: 'grey',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '5px 5px 0px 0px',
            backgroundImage: `url("${v.thumbnail}")`,
          }}
        >
          <Duration>
            <Heading color='white' size={200}>
              {videoDuration(v.duration)}
            </Heading>
          </Duration>
        </div>
      </Link>
      <Pane padding={5} display='flex'>
        <UserVideoCard v={v} />
      </Pane>
    </Pane>
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