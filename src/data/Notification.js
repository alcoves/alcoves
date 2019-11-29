import { createContext } from 'react';
import { decorate, observable } from 'mobx';

export class Notification {
  notification = {
    open: false,
    duration: null,
    vertical: '',
    horizontal: '',
    variant: '',
    message: '',
  };
}

decorate(Notification, { notification: observable });
export default createContext(new Notification());
