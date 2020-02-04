import { gql } from 'apollo-boost';
import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

const SAVE_VIDEO = gql`
  mutation updateVideo($id: ID!, $input: UpdateVideoInput!) {
    updateVideo(id: $id, input: $input) {
      id
    }
  }
`;

export default ({ title: propTitle, id }) => {
  const [title, setTitle] = useState(propTitle);
  const [saveVideo, { loading: saveLoading, error }] = useMutation(SAVE_VIDEO, {
    variables: { id, input: { title } },
  });

  return (
    <div>
      <Input
        fluid
        name='title'
        value={title}
        error={error}
        onChange={(e, { value }) => setTitle(value)}
        action={{
          icon: 'save',
          color: 'teal',
          content: 'Save',
          labelPosition: 'right',
          loading: saveLoading,
          onClick: () => saveVideo(),
        }}
      />
    </div>
  );
};
