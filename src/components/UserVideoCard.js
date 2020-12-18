import Link from 'next/link';
import moment from 'moment';
import { Avatar, Box, Text, } from 'grommet';
import { Spinner, } from 'evergreen-ui';
import { useApi, } from '../utils/api';
import abbreviateNumber from '../utils/abbreviateNumber';

export default function UserVideoCard({ v }) {
  const { data } = useApi(`/users/${v.userId}`);

  if (data) {
    return (
      <Box
        maring='small'
        align='flex-start'
        justify='flex-start'
        direction='row'
      >
        <Link href={`/u/${v.userId}`} passHref>
          <Avatar
            size='medium'
            src={data.avatar}
          />
        </Link>
        <Box style={{ paddingLeft: '10px' }}>
          <Text as={Link} href={`/v/${v.id}`} size='medium' cursor='pointer'>{v.title}</Text>
          <Link href={`/u/${data.username}`} passHref>
            <Text size='xsmall' style={{ cursor: 'pointer' }}>{data.username}</Text>
          </Link>
          <Text size='xsmall'>
            {`${abbreviateNumber(v.views)} views · ${moment(v.createdAt).fromNow()}`}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box minHeight='60px'>
      <Spinner />
    </Box>
  ); 
}