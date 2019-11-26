import { observable } from 'mobx';

class User {
  @observable id = '';
  @observable email = '';
  @observable accessToken = '';
}

export default User;
