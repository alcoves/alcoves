import userPool from './userPool';
import { atom, selector } from 'recoil';

// const userState = atom({
//   key: 'user',
//   default: null,
// });

const init = () => {
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

const userAtom = atom({
  key: 'userInit',
  default: null,
});

const selectorUser = selector({
  key: 'user',
  get: async () => init(),
});

export default selectorUser;
