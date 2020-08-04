import { CognitoUserPool } from 'amazon-cognito-identity-js';
import React, { createContext, useState, useEffect } from 'react';

export const CognitoContext = createContext();

export default function CognitoContextProvider({ children }) {
  const [pool] = useState(
    new CognitoUserPool({
      ClientId: process.env.REACT_APP_CLIENT_ID,
      UserPoolId: process.env.REACT_APP_USERPOOL_ID,
    }),
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  function getUser() {
    return new Promise((resolve, reject) => {
      const currentUser = pool.getCurrentUser();
      if (currentUser !== null) {
        currentUser.getSession(function (err, session) {
          if (err) return {};
          currentUser.getUserAttributes(function (err, attributes) {
            if (!err) {
              const user = {
                ...attributes.reduce((acc, { Name, Value }) => {
                  acc[Name] = Value;
                  return acc;
                }, {}),
              };
              resolve({ user, actions: currentUser });
            }
          });
        });
      }
    });
  }

  useEffect(() => {
    if (pool) {
      console.log('there is a pool');
      getUser().then(({ user, actions }) => {
        setUser(user);
        setActions(actions);
      });
    }
  }, [pool]);

  useEffect(() => {
    if (user && actions) {
      console.log('user is considered authenticated now');
      setLoading(false);
      setAuthenticated(true);
    }
  }, [user, actions]);

  return (
    <CognitoContext.Provider value={{ pool, user, actions, loading, authenticated, getUser }}>
      {children}
    </CognitoContext.Provider>
  );
}
