import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const SAVE_VIDEO = gql`
  mutation setVideoVisibility($id: String!, $visibility: String!) {
    setVideoVisibility(id: $id, visibility: $visibility) {
      id
    }
  }
`;

export default ({ visibility: vis, id }) => {
  const [visibility, setVisibility] = useState(vis);
  const [saveVideo] = useMutation(SAVE_VIDEO);

  const VisibilityOptions = [
    {
      key: 'unlisted',
      value: 'unlisted',
      text: 'Unlisted',
    },
  ];

  return (
    <div>
      {/* <Dropdown
        fluid
        selection
        value={visibility}
        options={VisibilityOptions}
        onChange={(e, { value }) => {
          setVisibility(value);
          saveVideo({
            variables: { id, visibility: value },
          });
        }}
      /> */}
    </div>
  );
};
