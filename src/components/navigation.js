import React from 'react';
import withMe from '../lib/withMe';
import favicon from '../../public/favicon.ico';

import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export default function Navigation() {
  const { me } = withMe();

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
      height: 'auto',
      display: 'flex',
      objectFit: 'cover',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <div>
      <div style={styles.menu}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            minWidth: '150px',
            justifyContent: 'flex-start',
          }}>
          <Link to='/'>
            <img src={favicon} style={{ ...styles.logo, cursor: 'pointer' }} />
          </Link>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            minWidth: '150px',
            paddingRight: '5px',
            justifyContent: 'flex-end',
          }}>
          <div>
            {me ? (
              <Button as={Link} to='/upload' circular size='medium' icon='upload' />
            ) : (
              <Button as={Link} to='/login' circular size='medium' icon='upload' />
            )}
          </div>
          <div>
            {me && me.sub ? (
              <Button as={Link} to={`/users/${me.sub}`} circular size='medium' icon='video' />
            ) : (
              <Button as={Link} to='/login' circular size='medium' icon='video' />
            )}
          </div>
          <div>
            {me ? (
              <Button to='/account' as={Link} circular size='medium' icon='user' />
            ) : (
              <Button to='/login' as={Link} circular size='medium' icon='user' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
