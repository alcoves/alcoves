import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  query me {
    me {
      id
    }
  }
`;

function withMe() {
  const { data } = useQuery(QUERY);
  if (data) return data.me
  return {}
}

export default withMe