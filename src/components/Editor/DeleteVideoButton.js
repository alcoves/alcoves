import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

const DELETE_VIDEO = gql`
  mutation deleteVideo($id: String!) {
    deleteVideo(id: $id)
  }
`;

function DeleteVideoButton({ id }) {
  const [deleteVideo, { loading, data }] = useMutation(DELETE_VIDEO, {
    variables: { id },
  });

  const history = useHistory();
  if (data) history.goBack();

  return (
    <Button
      color='secondary'
      disabled={loading}
      variant='outlined'
      onClick={deleteVideo}
      startIcon={<DeleteIcon />}>
      Delete
    </Button>
  );
}

export default DeleteVideoButton;
