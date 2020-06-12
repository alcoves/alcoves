import React from 'react';
import Logout from './Logout';
import withMe from '../lib/withMe';

import { Loader } from 'semantic-ui-react';

export default function Account() {
  const { loading, me } = withMe();

  if (loading) return <Loader active />;

  if (me) {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <div style={{ width: 400, margin: 20 }}>
          <div> you are logged in as {me.email}</div>
          <Logout />
        </div>
      </div>
    );
  }

  return <div>Error</div>;
}
