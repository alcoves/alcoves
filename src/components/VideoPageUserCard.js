import { useEffect, } from 'react';
import { Avatar, Box, Text, } from 'grommet';
import { useRouter, } from 'next/router';
import { useApiLazy, } from '../utils/api';

function VideoPageUserCard({ id }) {
  const router = useRouter();
  const [getUser, { data }] = useApiLazy(`/users/${id}`);
  useEffect(() => { getUser(); }, []);

  if (data) {
    return (
      <Box direction='row' height='75px'>
        <Avatar
          alt='avatar'
          src={data.avatar}
          style={{ cursor: 'pointer' }}
          onClick={() => router.push(`/u/${data.username}`)}
        />
        <Box margin='small'>
          <Text
            size='small'
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/u/${data.username}`)}
          >
            {data.username}
          </Text>
        </Box>
      </Box>
    );
  }

  return <Box />; 
}

export default VideoPageUserCard;