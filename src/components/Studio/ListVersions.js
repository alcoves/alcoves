import { Text, Heading, Box, } from 'grommet';
import { useEffect, } from 'react';
import styled from 'styled-components';
import { useApi,} from '../../utils/api';
import Icon from '../Icon';
import Spinner from '../Spinner';

let timer;

const ColoredIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${p => p.from};
  animation: change_color 2.5s infinite;

  @keyframes change_color {
    from { color: ${p => p.from}; }
    to { color: ${p => p.to}; transform:rotate(360deg); }
  }
`;

function Version({ version }) {
  const { name, status, percentCompleted } = version;
  return (
    <Box direction='row' margin='xsmall'>
      {status === 'completed' ? (
        <Icon color='green' name='check-circle' />
      ) : (
        <ColoredIcon from='orange' to='orange'>
          <Icon name='settings' />
        </ColoredIcon>
      )}
      <Box>
        <Text level='4'>
          {name}
        </Text>
        <Text>{`${percentCompleted}%`}</Text>
      </Box>
    </Box>
  );
}

export default function ListVersions({ id }) {
  const { data, error, refetch }  = useApi(`/videos/${id}/versions`);

  useEffect(() => {
    clearInterval(timer);
    timer = setInterval(() => {
      refetch();
    }, 3000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  if (data) {
    return (
      <Box>
        <Heading margin='xsmall' level='3'>
          Versions
        </Heading>
        <Box>
          {data.map(v => <Version key={v.name} version={v} />)}
        </Box>
      </Box>
    );
  }

  return (
    <Box align='center' pad='medium'>
      {error ? <div>{JSON.stringify(error)}</div> : <Spinner />}
    </Box>
  );
}