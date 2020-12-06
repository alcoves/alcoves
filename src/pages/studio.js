import { useContext, } from 'react';
import { Heading, } from 'evergreen-ui';
import Layout from '../components/Layout';
import { Context, } from '../utils/store';

export default function studio() {
  const { authenticated } = useContext(Context);

  if (!authenticated) {
    return (
      <Layout>
        <Heading>
          You must be logged
        </Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading>
        welcome to your studio
      </Heading>
    </Layout>
  );
}