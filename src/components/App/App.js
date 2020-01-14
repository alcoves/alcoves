import ReactGA from 'react-ga';
import UserStore from '../../data/User';
import React, { useContext } from 'react';

import Home from '../Home/Home';
import Login from '../Login/Login';
import Video from '../Video/Video';
import Upload from '../Upload/Upload';
import Profile from '../Profile/Profile';
import Register from '../Register/Register';
import NotFound from '../NotFound/NotFound';
import SearchPage from '../SearchPage/SearchPage';
import Navigation from '../Navigation/Navigation';
import UserProfile from '../UserProfile/UserProfile';
import VideoEditor from '../VideoEditor/VideoEditor';

import { observer } from 'mobx-react-lite';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

export default observer(p => {
  const user = useContext(UserStore);
  const accessToken = localStorage.getItem('accessToken');
  user.login(accessToken);

  if (user.isLoggedIn()) {
    ReactGA.set({ userId: user.id });
  }

  return (
    <Router history={history}>
      <Navigation {...p}>
        <Switch>
          <Route path='/' exact render={rp => <Home {...rp} {...p} />} />
          <Route path='/login' exact render={rp => <Login {...rp} {...p} />} />
          <Route path='/register' exact render={rp => <Register {...rp} {...p} />} />
          <Route path='/account' exact render={rp => <Profile {...rp} {...p} />} />
          <Route path='/upload' exact render={rp => <Upload {...rp} {...p} />} />
          <Route path='/search*' exact render={rp => <SearchPage {...rp} {...p} />} />
          <Route
            path='/videos/:videoId'
            render={rp => <Video id={rp.match.params.videoId} {...rp} {...p} />}
          />
          <Route path='/users/:userId' exact render={rp => <UserProfile {...rp} {...p} />} />
          <Route path='/editor/videos/:videoId' render={rp => <VideoEditor {...rp} {...p} />} />
          <Route path='*' render={rp => <NotFound {...rp} {...p} />} />
        </Switch>
      </Navigation>
    </Router>
  );
});
