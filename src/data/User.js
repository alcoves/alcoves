import React, { useState } from 'react';
import jwt from 'jsonwebtoken';

// const user = () => {
//   const [user, setUser] = useState({});

//   const isLoggedIn = () => {
//     return user.id ? true : false;
//   };

//   const login = async accessToken => {
//     try {
//       if (accessToken) {
//         const decoded = jwt.decode(accessToken, { complete: true });

//         const isTokenExpired = token => {
//           return token.payload.exp < Date.now() / 1000;
//         };

//         if (decoded && !isTokenExpired(decoded)) {
//           localStorage.setItem('accessToken', accessToken);
//           setUser({
//             id: decoded.payload.id,
//             email: decoded.payload.email,
//             displayName: decoded.payload.displayName,
//           });
//         } else {
//           logout();
//         }
//       }
//     } catch (error) {
//       logout();
//       console.error(error);
//       throw error;
//     }
//   };

//   const logout = async (refresh = false) => {
//     try {
//       // TODO :: Intergrate with apollo client client.resetStore()
//       // https://www.apollographql.com/docs/react/networking/authentication/

//       console.log('Logging user out');
//       setUser();
//       await localStorage.removeItem('accessToken');
//       if (refresh) window.location.reload();
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };
// };

class User {
  constructor() {
    this.id = '';
    this.email = '';
    this.displayName = '';
  }

  isLoggedIn = () => {
    return this.id ? true : false;
  };

  login = async accessToken => {
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
  };

  logout = async (refresh = false) => {
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
  };
}

export default React.createContext(new User());
