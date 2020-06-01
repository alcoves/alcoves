import React from 'react';
import gql from 'graphql-tag';
import withApollo from '../lib/withApollo';

import { Loader } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  query {
    helloWorld
  }
`;

function VideoWrapper({ id }) {
  const { data } = useQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  if (data) {
    console.log(data);
  }

  return (
    <div>
      {data ? (
        <div>{data.helloWorld}</div>
      ) : (
        <Loader active inline='centered' style={{ marginTop: '30px' }} />
      )}
    </div>
  );
}

export default withApollo({ ssr: true })(VideoWrapper);
