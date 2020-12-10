import { Pane, SegmentedControl, toaster, } from 'evergreen-ui';
import { useState, useEffect, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditVisibility({ id, visibility: v }) {
  const options = [
    { label: 'Unlisted', value: 'unlisted' },
    { label: 'Public', value: 'public' },
  ];
  
  const [updateVideo, { loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [visibility, setVisibility ] = useState(v);

  useEffect(() => {
    if (!loading && error) {
      toaster.danger('Failed to update video visibility');
    }
  }, [loading]);

  async function handleChange(vis) {
    await updateVideo({ data: { visibility: vis } });
    setVisibility(vis);
  }

  return (
    <Pane display='flex' width='100%'>
      <SegmentedControl
        width='100%'
        height={32}
        name='visibility'
        options={options}
        value={visibility}
        onChange={vis => handleChange(vis)}
      />
    </Pane>
  );
}