import React from 'react';

import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

function Index() {
  return (
    <Layout>
      <Navigation />
      <style jsx>
        {`
          display: flex;
          justify-content: center;
          align-items: center;
          height: 500px;
        `}
      </style>
      <div>
        <h1>Simple video sharing</h1>
      </div>
    </Layout>
  );
}

export default Index;
