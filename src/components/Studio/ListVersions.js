import { Text, Heading, Pane, } from 'evergreen-ui';
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
    <Pane minWidth={200} display='flex'>
      {status === 'completed' ? (
        <Icon color='green' name='check-circle' />
      ) : (
        <ColoredIcon from='orange' to='orange'>
          <Icon name='settings' />
        </ColoredIcon>
      )}
      <Pane display='flex' flexDirection='column'>
        <Heading size={400}>
          {name}
        </Heading>
        <Text>{`${percentCompleted}%`}</Text>
      </Pane>
    </Pane>
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
      <Pane display='flex' flexDirection='column'>
        <Heading size={500}>
          Versions
        </Heading>
        <Pane display='flex' flexDirection='column'>
          {data.map(v => <Version key={v.name} version={v} />)}
        </Pane>
      </Pane>
    );
  }

  return (
    <Pane display='flex' justifyContent='center'>
      {error ? <div>{JSON.stringify(error)}</div> : <Spinner />}
    </Pane>
  );
}