import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';

export default function StudioEditVideo() {
  const [getVideo, {  }] = useApiLazy();

  return (
    <Layout>
      test
    </Layout>
  );
}