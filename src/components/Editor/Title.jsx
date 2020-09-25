import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import React, { useState, } from 'react';
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

export default ({ id }) => {
  const [title, setTitle] = useState(null);

  const { data } = useQuery(GET_VIDEO, {
    variables: { id },
  });

  const [saveVideo, { loading }] = useMutation(UPDATE_VIDEO_TITLE);

  return (
    <Grid container alignItems='flex-end' spacing={1} style={{ margin: '10px 0px 10px 0px' }}>
      <Grid item xs={10}>
        <TextField fullWidth name='title' defaultValue={data?.video?.title} onChange={e => setTitle(e.target.value)} />
      </Grid>
      <Grid item xs={2}>
        <Button
          color='primary'
          fullWidth
          disabled={loading}
          onClick={() => {
            saveVideo({ variables: { input: { id, title } } });
          }}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
};
