import Layout from '../../components/Layout';
import withApollo from '../../lib/withApollo';
import Navigation from '../../components/Navigation';
import VideoEditor from '../../components/VideoEditor/VideoEditor';

function Edit() {
  return (
    <Layout>
      <Navigation />
      <VideoEditor />
    </Layout>
  );
}

export default withApollo({ ssr: false })(Edit);
