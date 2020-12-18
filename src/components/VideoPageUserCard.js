
import Link from 'next/link';
import { useEffect, } from 'react';
import { Avatar, Box, Text, } from 'grommet';
import { useApiLazy, } from '../utils/api';

function VideoPageUserCard({ id }) {
  const [getUser, { data }] = useApiLazy(`/users/${id}`);
  useEffect(() => { getUser(); }, []);

  if (data) {
    return (
      <Box direction='row' height='75px'>
        <Link href={`/u/${data.username}`} passHref>
          <Avatar
            alt='avatar'
            src={data.avatar}
            style={{ cursor: 'pointer' }}
          />
        </Link>
        <Box margin='small'>
          <Text href={`/u/${data.username}`} as={Link} size='small'>{data.username}</Text>
        </Box>
      </Box>
    );
  }

  return <Box />; 
}

export default VideoPageUserCard;