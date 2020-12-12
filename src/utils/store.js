import jwt from 'jsonwebtoken';
import React, { createContext, useState, useEffect, } from 'react';

const Context = createContext();

function Provider({ children }) {
  const [store, setStore] = useState({
    user: null,
    authenticated: false,
    login(token) {
      if (token) localStorage.setItem('token', token);
      const decoded = jwt.decode(localStorage.getItem('token'));
  
      if (decoded) {
        // TODO :: Check for token expiry
        console.log('loaded user successfully');
        setStore({
          ...store,
          user: { ...decoded },
          authenticated: true,
        });
      }
    },
    logout() {
      console.log('logging out user');
      localStorage.removeItem('token');
      setStore({
        ...store,
        user: null,
        authenticated: false,
      });
    },
  });

  useEffect(() => { if (!store.user) store.login(); }, []);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export { Context, Provider };