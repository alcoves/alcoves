import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { Checkbox } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

const SAVE_VIDEO = gql`
  mutation updateVideo($id: ID!, $input: UpdateVideoInput!) {
    updateVideo(id: $id, input: $input) {
      id
    }
  }
`;

export default ({ published, id }) => {
  const [checked, setChecked] = useState(published);
  const [saveVideo] = useMutation(SAVE_VIDEO);

  useEffect(() => {
    console.log('use effect');

    if (checked !== published) {
      console.log('use effect2');
      saveVideo({
        variables: { id, input: { published: checked } },
      });
    }
  }, [checked]);

  console.log('published', published);
  console.log('checked', checked);
  return (
    <div>
      <Checkbox
        checked={checked}
        label='Make video public'
        onChange={(e, { checked }) => {
          setChecked(checked);
        }}
      />
    </div>
  );
};
