import User from '../../data/User';
import React, { useContext } from 'react';

import { Row, Col, Button } from 'antd';
import { observer } from 'mobx-react-lite';

export default observer(() => {
  const user = useContext(User);

  if (user.isLoggedIn()) {
    return (
      <div>
        <Row>
          <Col span={24}>
            <h1>Hey there, {user.id}!</h1>
          </Col>
        </Row>
        <Button
          type='primary'
          onClick={() => {
            user.logout();
          }}>
          Logout
        </Button>
      </div>
    );
  } else {
    return <div>You aren't logged in!</div>;
  }
});
