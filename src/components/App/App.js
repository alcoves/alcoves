import React from 'react';

import Login from '../Login/Login';
import TopBar from '../TopBar/TopBar';
import Content from '../Content/Content';

import jwt from 'jsonwebtoken';

import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { withCookies } from 'react-cookie';

@observer
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: false,
    };
  }

  componentDidMount() {
    const accessToken = this.props.cookies.get('accessToken');

    if (accessToken) {
      console.log('accessToken present');

      const { payload } = jwt.decode(accessToken, { complete: true });

      console.log(payload);

      // this.props.stores.user.id = payload.userId;
      // this.props.stores.user.email = payload.email;
      // console.log(this.props.stores.user.id);

      this.setState({ loading: false });
    } else {
      console.log('no accessToken present');
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.error) {
      return <div> {this.state.error} </div>;
    }

    if (this.state.loading) {
      return <div />;
    } else {
      return (
        <div>
          <TopBar {...this.props} />
          <Switch>
            <Route
              path='/login'
              render={routerProps => <Login {...routerProps} {...this.props} />}
            />
            <Route path='/' render={routerProps => <Content {...routerProps} {...this.props} />} />
          </Switch>
        </div>
      );
    }
  }
}

export default withCookies(Root);
