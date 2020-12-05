import jwt from 'jsonwebtoken';
import React, { createContext, useState, useEffect, } from 'react';

const Context = createContext();

function Provider({ children }) {
  const [store, setStore] = useState({
    user: null,
    search: null,
    authenticated: false,
  });

  function login(token) {
    if (token) localStorage.setItem('token', token);
    const decoded = jwt.decode(localStorage.getItem('token'));

    if (decoded) {
      // TODO :: Check for token expiry
      console.log('loaded user successfully');
      setStore({
        ...store,
        user: {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
        },
        authenticated: true,
      });
    }
  }

  function logout() {
    console.log('logging out user');
    localStorage.removeItem('token');
    setStore({
      ...store,
      user: null,
      authenticated: false,
    });
  }

  useEffect(() => {
    if (!store.user) login();
  }, []);

  return <Context.Provider value={{ ...store, logout, login }}>{children}</Context.Provider>;
}

export { Context, Provider };