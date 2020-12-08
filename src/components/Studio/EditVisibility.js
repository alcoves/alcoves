import { Pane, SegmentedControl, toaster, } from 'evergreen-ui';
import { useState, useEffect, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditVisibility({ id, visibility: v }) {
  const options = [
    { label: 'Unlisted', value: 'unlisted' },
    { label: 'Public', value: 'public' },
  ];
  
  const [updateVideo, { data, loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [visibility, setVisibility ] = useState(v);

  useEffect(() => {
    if (!loading && data) {
      toaster.success('Successfully updated video visibility');
    }

    if (!loading && error) {
      toaster.danger('Failed to update video visibility');
    }
  }, [loading]);

  return (
    <Pane display='flex' width='100%' marginLeft={10} marginRight={10}>
      <SegmentedControl
        width='100%'
        height={32}
        name='visibility'
        value={visibility}
        options={options}
        onChange={vis => {
          setVisibility(vis);
          updateVideo({ data: { visibility: vis } });
        }}
      />
    </Pane>
  );
}