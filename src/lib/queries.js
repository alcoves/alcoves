import gql from 'graphql-tag';

export const createMultipartUploadMutation = gql`
  mutation createMultipartUpload($input: CreateMultipartUploadInput!) {
    createMultipartUpload(input: $input) {
      key
      urls
      uploadId
      objectId
    }
  }
`;

export const completedMultipartUploadMutation = gql`
  mutation completeMultipartUpload($input: CompleteMultipartUploadInput!) {
    completeMultipartUpload(input: $input) {
      completed
    }
  }
`;
