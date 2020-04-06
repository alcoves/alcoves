const { gql } = require('graphql-tag')

export const registerMutation = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      accessToken
    }
  }
`;