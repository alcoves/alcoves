
import Link from 'next/link';
import { useEffect, } from 'react';
import { lazyApi, } from '../utils/api';

function VideoPageUserCard({ id }) {
  const [getUser, { data, error, loading, called }] = lazyApi(`/users/${id}`);

  useEffect(() => {
    getUser();
  }, []);

  if (data) {
    return (
      <div
        style={{
          display: 'flex',
          marginTop: '10px',
          height: '75px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px',
          }}
        >
          <Link href={`/users/${data.user.username}`} passHref>
            <img
              alt=''
              width={50}
              height={50}
              src={data.user.avatar}
              style={{
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            />
          </Link>
        </div>
        <div style={{ height: '100%' }}>
          <Link
            href={`/users/${data.user.username}`}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              height: '50%',
            }}
          >
            <a>{data.user.username}</a>
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              height: '50%',
            }}
          />
        </div>
      </div>
    );
  }

  return <div />; 
}

export default VideoPageUserCard;