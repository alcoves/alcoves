import { atom } from 'recoil';
import userPool from './userPool';

const userAtom = atom({
  key: 'user',
  default: null,
});

export const init = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.getSession(function (err, session) {
        if (err) return {};
        cognitoUser.getUserAttributes(function (err, attributes) {
          if (!err) {
            resolve({
              ...attributes.reduce((acc, { Name, Value }) => {
                acc[Name] = Value;
                return acc;
              }, {}),
            });
          }
        });
      });
    }
  });
};

export default userAtom;
