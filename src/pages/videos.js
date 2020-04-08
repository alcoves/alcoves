import gql from 'graphql-tag';
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'

const QUERY = gql`
  query getVideo($id: String!) {
    video(id: $id) {
      id
      title
      views
      createdAt
      user {
        id
        avatar
        displayName
      }
      versions {
        link
        status
        preset
      }
    }
  }
`;

export default function CatchAll() {
  const router = useRouter();
  const { data, error, loading } = useQuery(QUERY, { variables: { id: router.query.id } });

  return (
    <Fragment>
      <h1>This will catch any route that doesn't match a static one...</h1>
      <pre>{JSON.stringify({ router, data, error, loading }, null, 2)}</pre>
    </Fragment>
  )
}