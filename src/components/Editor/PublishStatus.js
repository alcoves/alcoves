import { useSnackbar } from 'notistack';
import { gql, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import VisibilityPublic from '@material-ui/icons/VisibilityOutlined';
import VisibilityUnlisted from '@material-ui/icons/VisibilityOffOutlined';

const SAVE_VIDEO = gql`
  mutation updateVideoVisibility($id: String!, $visibility: VisibilityOption!) {
    updateVideoVisibility(id: $id, visibility: $visibility) {
      id
    }
  }
`;

export default ({ visibility: vis, id }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [visibility, setVisibility] = useState(vis);
  const [saveVideo, { called, loading, error }] = useMutation(SAVE_VIDEO);

  useEffect(() => {
    if (called && !loading) {
      if (error) {
        enqueueSnackbar(error.message, { variant: 'error', persist: false });
      } else {
        enqueueSnackbar('visibility saved', { variant: 'success', persist: false });
      }
    }
  }, [error, called, loading]);

  return (
    <ToggleButtonGroup
      exclusive
      value={visibility}
      aria-label="visibility"
      onChange={(e, newVis) => {
        if (newVis) {
          setVisibility(newVis);
          saveVideo({ variables: { id, visibility: newVis } });
        }
      }}
    >
      <ToggleButton value="unlisted" aria-label="unlisted">
        <VisibilityUnlisted />
      </ToggleButton>
      <ToggleButton value="public" aria-label="public">
        <VisibilityPublic />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
