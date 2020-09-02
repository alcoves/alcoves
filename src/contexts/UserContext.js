import jwt from 'jsonwebtoken';
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(token) {
    if (token) localStorage.setItem('token', token);
    const decoded = jwt.decode(localStorage.getItem('token'));

    if (decoded) {
      // TODO :: Check for token expiry
      console.log('loaded user successfully');
      setUser({
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
      });
    }
  }

  function logout() {
    console.log('logging out user');
    localStorage.removeItem('token');
    setUser(null);
  }

  useEffect(() => {
    if (!user) login();
  }, []);

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
}
