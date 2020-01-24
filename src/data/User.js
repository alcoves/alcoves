import jwt from 'jsonwebtoken';

import { createContext } from 'react';
import { decorate, observable } from 'mobx';

export class User {
  id = '';
  email = '';
  displayName = '';

  isLoggedIn() {
    return this.id ? true : false;
  }

  async login(accessToken) {
    try {
      if (accessToken) {
        const decoded = jwt.decode(accessToken, { complete: true });

        const isTokenExpired = token => {
          return token.payload.exp < Date.now() / 1000;
        };

        if (decoded && !isTokenExpired(decoded)) {
          localStorage.setItem('accessToken', accessToken);
          this.id = decoded.payload.id;
          this.email = decoded.payload.email;
          this.displayName = decoded.payload.displayName;
        } else {
          this.logout();
        }
      }
    } catch (error) {
      this.logout();
      console.error(error);
      throw error;
    }
  }

  async logout(refresh = false) {
    try {
      // TODO :: Intergrate with apollo client client.resetStore()
      // https://www.apollographql.com/docs/react/networking/authentication/

      console.log('Logging user out');
      await localStorage.removeItem('accessToken');
      if (refresh) window.location.reload();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

decorate(User, { user: observable });
export default createContext(new User());
