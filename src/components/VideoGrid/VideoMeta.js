import moment from 'moment';
import { Avatar, Box, Text, } from 'grommet';
import { useRouter, } from 'next/router';
import abbreviateNumber from '../../utils/abbreviateNumber';

export default function VideoMeta({ v, u }) {
  const router = useRouter();

  return (
    <Box
      align='start'
      justify='start'
      direction='row'
      style={{ margin: '10px 0px 10px 0px' }}
    >
      {u && (
        <Avatar
          size='medium'
          src={u.avatar}
          onClick={() => router.push(`/u/${v.userId}`)}
        />
      )}
      <Box style={{ paddingLeft: !u ? '0px' : '10px' }}>
        <Text
          size='medium'
          cursor='pointer'
          style={{ cursor: 'pointer' }}
          onClick={() => router.push(`/v/${v.id}`)}
        >
          {v.title}
        </Text>
        {u && (
          <Text
            size='xsmall'
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/u/${u.username}`)}
          >
            {u.username}
          </Text>
        )}
        <Text size='xsmall'>
          {`${abbreviateNumber(v.views)} views · ${moment(v.createdAt).fromNow()}`}
        </Text>
      </Box>
    </Box>
  );
}