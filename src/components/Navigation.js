import React from 'react';
import Link from 'next/link';

import withMe from '../lib/withMe';
import { Button } from 'semantic-ui-react';
import withApollo from '../lib/withApollo';

function Navigation() {
  const me = withMe();

  const styles = {
    menu: {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#efefef',
      justifyContent: 'space-between',
    },
    logo: {
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <div>
      <div style={styles.menu}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            minWidth: '150px',
            flex: 1,
          }}>
          <Link href='/'>
            <img style={{ ...styles.logo, cursor: 'pointer' }} height={35} src='../favicon.ico' />
          </Link>
        </div>

        {me ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              minWidth: '150px',
              paddingRight: '5px',
              flex: 1,
            }}>
            <div style={styles.menuItem}>
              <Link href='/upload'>
                <Button as='a' circular size='medium' icon='upload' />
              </Link>
            </div>
            <div style={styles.menuItem}>
              <Link href={`/users/${me.id}`}>
                <Button as='a' circular size='medium' icon='video' />
              </Link>
            </div>
            <div style={styles.menuItem}>
              <Link href='/account'>
                <Button as='a' circular size='medium' icon='user' />
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              minWidth: '150px',
              paddingRight: '5px',
              flex: 1,
            }}>
            <div style={styles.menuItem}>
              <Link href='/login'>
                <Button as='a' circular icon='user' />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withApollo({ ssr: true })(Navigation);
