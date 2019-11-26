import React from 'react';
import ReactDOM from 'react-dom';

import Login from '../Login/Login';
import TopBar from '../TopBar/TopBar';
import Content from '../Content/Content';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { withCookies } from 'react-cookie';
import { reAuthenticate } from '../../api/api';

@observer
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      authenticated: false,
    };
  }

  componentDidMount() {
    reAuthenticate(this.props.cookies)
      .then(() => {
        this.setState({ authenticated: true });
      })
      .catch(error => {
        this.setState({ error: JSON.stringify(error, null, 2) });
      });
  }

  render() {
    if (this.state.error) {
      return <div> {this.state.error} </div>;
    }

    if (this.state.authenticated) {
      return (
        <div>
          <TopBar />
          <Switch>
            <Route
              path='/login'
              render={routerProps => <Login {...routerProps} {...this.props} />}
            />
            <Route path='/' render={routerProps => <Content {...routerProps} {...this.props} />} />
          </Switch>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default withCookies(Root);
