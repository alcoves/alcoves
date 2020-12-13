
import Link from 'next/link';
import { useEffect, } from 'react';
import { Pane, Text, }  from 'evergreen-ui';
import { useApiLazy, } from '../utils/api';

function VideoPageUserCard({ id }) {
  const [getUser, { data }] = useApiLazy(`/users/${id}`);
  useEffect(() => { getUser(); }, []);

  if (data) {
    return (
      <Pane display='flex' marginTop='10px' height='75px'>
        <Pane display='flex' marginRight='10px'>
          <Link href={`/u/${data.username}`} passHref>
            <img
              width={50}
              height={50}
              alt='avatar'
              src={data.avatar}
              style={{
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            />
          </Link>
        </Pane>
        <Pane height='100%'>
          <Link
            href={`/u/${data.username}`}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              height: '50%',
            }}
          >
            <Text cursor='pointer'>{data.username}</Text>
          </Link>
          <Pane
            height='50%'
            display='flex'
            alignItems='flex-start'
          />
        </Pane>
      </Pane>
    );
  }

  return <Pane />; 
}

export default VideoPageUserCard;