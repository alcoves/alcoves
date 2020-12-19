import moment from 'moment';
import { Avatar, Box, Text, } from 'grommet';
import { useRouter, } from 'next/router';
import { useApi, } from '../utils/api';
import abbreviateNumber from '../utils/abbreviateNumber';
import Spinner from './Spinner';

export default function UserVideoCard({ v }) {
  const router = useRouter();
  const { data } = useApi(`/users/${v.userId}`);

  if (data) {
    return (
      <Box
        maring='small'
        align='flex-start'
        justify='flex-start'
        direction='row'
      >
        <Avatar
          size='medium'
          src={data.avatar}
          onClick={() => router.push(`/u/${v.userId}`)}
        />
        <Box style={{ paddingLeft: '10px' }}>
          <Text
            size='medium'
            cursor='pointer'
            onClick={() => router.push(`/v/${v.id}`)}
          >
            {v.title}
          </Text>
          <Text
            size='xsmall'
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/u/${data.username}`)}
          >
            {data.username}
          </Text>
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