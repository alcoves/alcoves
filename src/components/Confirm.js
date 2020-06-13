import qs from 'qs';
import userPool from '../lib/userPool';

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Card, Input, Loader } from 'semantic-ui-react';

function Confirm() {
  const { username } = qs.parse(window.location.search.substring(1));
  const history = useHistory();
  const [code, setCode] = useState('');

  const confirmUser = () => {
    const cognitoUser = new CognitoUser({
      Pool: userPool,
      Username: username,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return alert(err.message || JSON.stringify(err));
      history.push(`/login`);
    });
  };

  if (!username) {
    return (
      <div>
        <Loader active />
      </div>
    );
  } else {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Card>
            <Card.Content>
              <Card.Header style={{ padding: '5px 0px 5px 0px' }}>Hey {username}!</Card.Header>
              <Card.Content style={{ padding: '5px 0px 5px 0px' }}>
                <Input
                  action={{
                    icon: 'code',
                    color: 'teal',
                    content: 'Confirm',
                    onClick: confirmUser,
                    labelPosition: 'right',
                  }}
                  fluid
                  value={code}
                  placeholder='Code'
                  onChange={(e, { value }) => setCode(value)}
                />
              </Card.Content>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }
}

export default Confirm;
