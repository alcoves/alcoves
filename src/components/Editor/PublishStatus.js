import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const SAVE_VIDEO = gql`
  mutation setVideoVisability($id: String!, $visability: String!) {
    setVideoVisability(id: $id, visability: $visability) {
      id
    }
  }
`;

export default ({ visability: vis, id }) => {
  const [visability, setVisability] = useState(vis);
  const [saveVideo] = useMutation(SAVE_VIDEO);

  const visabilityOptions = [
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
        value={visability}
        options={visabilityOptions}
        onChange={(e, { value }) => {
          setVisability(value);
          saveVideo({
            variables: { id, visability: value },
          });
        }}
      /> */}
    </div>
  );
};
