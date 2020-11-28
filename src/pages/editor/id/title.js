import React from 'react';
import TextField from '@material-ui/core/TextField';

import { CircularProgress, } from '@material-ui/core';
import { gql, useMutation, useQuery, } from '@apollo/client';

const GET_VIDEO = gql`
  query video($id: String!) {
    video(id: $id) {
      title
    }
  }
`;

const UPDATE_VIDEO_TITLE = gql`
  mutation updateVideoTitle($input: UpdateVideoTitleInput!) {
    updateVideoTitle(input: $input) {
      id
    }
  }
`;

let autosaveTimeout;

export default ({ id }) => {
  const { data } = useQuery(GET_VIDEO, { variables: { id } });
  const [saveVideo, { loading }] = useMutation(UPDATE_VIDEO_TITLE);

  return (
    <div style={{ margin: '10px 0px 10px 0px' }}>
      <TextField
        fullWidth
        name='title'
        size='small'
        disabled={loading}
        variant='outlined'
        defaultValue={data?.video?.title}
        onChange={(e) => {
          clearTimeout(autosaveTimeout);
          autosaveTimeout = setTimeout(() => {
            saveVideo({ variables: { input: { id, title: e.target.value } } });
          }, 2000);
        }}
        InputProps={{
          endAdornment: (
            <div>
              {loading ? <CircularProgress style={{ height: '20px', width: '20px' }} /> : <div />}
            </div>
          ),
        }}
      />
    </div>
  );
};
