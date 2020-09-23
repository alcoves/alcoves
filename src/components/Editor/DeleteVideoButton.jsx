import React, { useEffect, } from 'react';
import Button from '@material-ui/core/Button';

import { useSnackbar, } from 'notistack';
import { useHistory, } from 'react-router-dom';
import { gql, useMutation, } from '@apollo/client';

const DELETE_VIDEO = gql`
  mutation deleteVideo($id: String!) {
    deleteVideo(id: $id)
  }
`;

function DeleteVideoButton({ id }) {
  const { enqueueSnackbar } = useSnackbar();
  const [deleteVideo, { loading, data, error }] = useMutation(DELETE_VIDEO, {
    variables: { id },
    refetchQueries: ['videosByUsername'],
  });

  useEffect(() => {
    if (error) enqueueSnackbar(error.message, { variant: 'error', persist: false });
  }, [error]);

  const history = useHistory();
  if (data) history.goBack();

  return (
    <Button color='secondary' disabled={loading} variant='outlined' onClick={deleteVideo}>
      Delete
    </Button>
  );
}

export default DeleteVideoButton;
