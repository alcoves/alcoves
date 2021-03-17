import { useRouter, } from 'next/router';
import UserCard from './UserCard';
import VideoMeta from './VideoMeta';
import videoDuration from '../../utils/videoDuration';

function VideoCard({ v, noUser }) {
  const router = useRouter();

  const styles = {
    Duration: {
      right: '0',
      bottom: '0',
      zIndex: '0',
      color: 'white',
      fontSize: '12px',
      fontWeight: '600',
      position: 'absolute',
      borderRadius: '3px',
      margin: '0px 3px 3px 0px',
      padding: '0px 3px 0px 3px',
      background: 'rgba(0, 0, 0, 0.7)',
    },
    VideoThumbnailBox: {
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
      backgroundImage:`url("${v.thumbnail}")`,
    },
  };

  return (
    <div>
      <div onClick={() => router.push(`/v/${v.videoId}`)}>
        <div style={styles.VideoThumbnailBox}>
          <div style={styles.Duration}>
            <p size='xsmall'>
              {videoDuration(v.duration)}
            </p>
          </div>
        </div>
      </div>
      {noUser ? <VideoMeta v={v} /> : <UserCard v={v} />}
    </div>
  );
}

export default function VideoGrid({ videos, noUser }) {
  const styles = {
    VideoGridWrapper: {
      display: 'grid',
      gridGap: '1rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
  };
  
  return (
    <div style={styles.VideoGridWrapper}>
      {videos.map((v) => <VideoCard key={v.videoId} v={v} noUser={noUser} />)}
    </div>
  );
}