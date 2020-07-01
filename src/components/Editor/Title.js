import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { gql } from 'apollo-boost';
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

const GET_VIDEO = gql`
  query video($id: String!) {
    video(id: $id) {
      title
    }
  }
`;

const SAVE_VIDEO = gql`
  mutation updateVideoTitle($id: String!, $title: String!) {
    updateVideoTitle(id: $id, title: $title) {
      id
    }
  }
`;

export default ({ id }) => {
  const [title, setTitle] = useState(null);

  const { data } = useQuery(GET_VIDEO, {
    variables: { id },
  });

  const [saveVideo, { loading }] = useMutation(SAVE_VIDEO, {
    variables: { id, title },
  });

  if (data && data.video && data.video.title && !title) {
    setTitle(data.video.title);
  }

  return (
    <Grid container alignItems='flex-end' spacing={1} style={{ margin: '10px 0px 10px 0px' }}>
      <Grid item xs={10}>
        <TextField fullWidth name='title' value={title} onChange={e => setTitle(e.target.value)} />
      </Grid>
      <Grid item xs={2}>
        <Button color='primary' fullWidth disabled={loading} onClick={saveVideo}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
};
