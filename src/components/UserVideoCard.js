import Link from 'next/link';
import moment from 'moment';
import { Text, Pane, Avatar, Heading, Spinner, } from 'evergreen-ui';
import { useApi, } from '../utils/api';
import abbreviateNumber from '../utils/abbreviateNumber';

export default function UserVideoCard({ v }) {
  const { data } = useApi(`/users/${v.userId}`);

  if (data) {
    return (
      <Pane display='flex' minHeight='60px'>
        <Pane
          padding={2}
          display='flex'
          marginRight={5}
          alignItems='center'
          justifyContent='center'
        >
          <Avatar
            size={50}
            src={data.avatar}
            name={data.username}
          />
        </Pane>
        <Pane>
          <Link href={`/v/${v.id}`} passHref>
            <Heading size={500} cursor='pointer'>{v.title}</Heading>
          </Link>
          <Pane>
            <Link href={`/u/${data.username}`} passHref>
              <Text size={300} cursor='pointer'>{data.username}</Text>
            </Link>
          </Pane>
          <Text size={300} cursor='pointer'>
            {`${abbreviateNumber(v.views)} views · ${moment(v.createdAt).fromNow()}`}
          </Text>
        </Pane>
      </Pane>
    );
  }

  return (
    <Pane minHeight='60px'>
      <Spinner />
    </Pane>
  ); 
}