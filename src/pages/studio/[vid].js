import { Spinner, Pane, TextInput, Button, toaster, } from 'evergreen-ui';
import { useRouter, } from 'next/router';
import { useState, useEffect, } from 'react';
import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';

function TitleField({ id, title: t }) {
  const [updateVideo, { data, loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [title, setTitle ] = useState(t);

  useEffect(() => {
    if (data) {
      toaster.success('Successfully updated video title');
    }

    if (error) {
      toaster.danger('Failed to update video title');
    }
  }, [data, error]);

  return (
    <Pane
      display='flex'
    >
      <TextInput
        width='350px'
        onChange={({ target }) => {
          setTitle(target.value);
        }}
        name='title'
        value={title}
        placeholder='Enter a title'
      />
      <Button
        marginLeft={5}
        intent='success'
        isLoading={loading}
        appearance='minimal'
        onClick={() => {
          updateVideo({ data: { title }});
        }}
      >
        Save
      </Button>
    </Pane>
  );
}

export default function StudioEditVideo() {
  const [getVideo, { data }] = useApiLazy();
  const router = useRouter();
  const { vid } = router.query;

  useEffect(() => {
    if (vid) getVideo({ url: `/videos/${vid}` });
  }, [vid]);

  if (data) {
    return (
      <Layout>
        <Pane>
          <TitleField id={data.id} title={data.title} />
        </Pane>
      </Layout>
    );
  }

  return (
    <Layout>
      <Spinner />
    </Layout>
  );
}