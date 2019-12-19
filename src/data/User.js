import jwt from 'jsonwebtoken';

import { createContext } from 'react';
import { decorate, observable } from 'mobx';

export class User {
  id = '';
  email = '';
  lastName = '';
  firstName = '';

  isLoggedIn() {
    return this.id ? true : false;
  }

  async login(accessToken) {
    try {
      const { payload } = jwt.decode(accessToken, {
        complete: true,
      });

      localStorage.setItem('accessToken', accessToken);
      this.id = payload.userId;
      this.email = payload.email;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async logout() {
    try {
      console.log('Logging user out');
      await localStorage.removeItem('accessToken');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

decorate(User, { user: observable });
export default createContext(new User());
