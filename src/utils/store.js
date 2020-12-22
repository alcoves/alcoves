import jwt from 'jsonwebtoken';
import LogRocket from 'logrocket';
import React, { createContext, useState, useEffect, } from 'react';

const Context = createContext();

function Provider({ children }) {
  const [store, setStore] = useState({
    user: null,
    loading: true,
    authenticated: false,
    login(token) {
      if (token) localStorage.setItem('token', token);
      const decoded = jwt.decode(localStorage.getItem('token'));
  
      if (decoded) {
        // TODO :: Check for token expiry
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
          LogRocket.identify(decoded.id, {
            email: decoded.email,
            name: decoded.username,
            username: decoded.username,
          });
        }

        setStore({
          ...store,
          user: { ...decoded },
          loading: false,
          authenticated: true,
        });
      } else {
        setStore({
          ...store,
          loading: false,
          authenticated: false,
        });
      }
    },
    logout() {
      console.log('logging out user');
      localStorage.removeItem('token');
      setStore({
        ...store,
        user: null,
        loading: false,
        authenticated: false,
      });
    },
  });

  useEffect(() => { if (!store.user) store.login(); }, []);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export { Context, Provider };