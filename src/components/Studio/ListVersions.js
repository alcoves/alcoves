import { Text, Heading, Pane, Spinner, } from 'evergreen-ui';
import { useEffect, } from 'react';
import { useApi,} from '../../utils/api';

let timer;

function Version({ version }) {
  const { name, status, percentCompleted } = version;
  return (
    <Pane minWidth={200}>
      <Heading size={300}>   
        {name}
      </Heading>
      <Text>{`${percentCompleted}% ${status}`}</Text>
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