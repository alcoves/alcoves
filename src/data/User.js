import { createContext } from 'react';
import { decorate, observable, computed } from 'mobx';

export class User {
  user = {
    id: '',
    email: '',
  };
}

decorate(User, { user: observable });
export default createContext(new User());
