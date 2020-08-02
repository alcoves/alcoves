import { useSnackbar } from 'notistack';
import { gql, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const SAVE_VIDEO = gql`
  mutation setVideoVisibility($id: String!, $visibility: String!) {
    setVideoVisibility(id: $id, visibility: $visibility) {
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
      enqueueSnackbar('visibility saved', { variant: 'success', persist: false });
    }

    if (called && !loading && error) {
      enqueueSnackbar(error.message, { variant: 'error', persist: false });
    }
  }, [error, called, loading]);

  return (
    <div>
      <Select
        fullWidth
        disabled={loading}
        value={visibility}
        onChange={e => {
          setVisibility(e.target.value);
          saveVideo({ variables: { id, visibility: e.target.value } });
        }}>
        <MenuItem value='private'>Private</MenuItem>
        <MenuItem value='unlisted'>Unlisted</MenuItem>
        <MenuItem value='public'>Public</MenuItem>
      </Select>
    </div>
  );
};
