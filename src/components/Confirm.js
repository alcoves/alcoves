import userPool from '../lib/userPool';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Card, Input, Loader } from 'semantic-ui-react';

function Confirm() {
  const router = useRouter();
  const { code: queryCode, userName } = router.query;

  const [code, setCode] = useState('');

  useEffect(() => {
    if (queryCode) setCode(queryCode);
  });

  const confirmUser = () => {
    const cognitoUser = new CognitoUser({
      Pool: userPool,
      Username: userName,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return alert(err.message || JSON.stringify(err));
      console.log('confirm: ' + result);
      router.push(`/login`);
    });
  };

  if (!userName) {
    return (
      <Layout>
        <Navigation />
        <Loader active />
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Navigation />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Card>
            <Card.Content>
              <Card.Header style={{ padding: '5px 0px 5px 0px' }}>Hey {userName}!</Card.Header>
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
      </Layout>
    );
  }
}

export default Confirm;
