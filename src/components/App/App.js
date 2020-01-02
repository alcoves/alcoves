import UserStore from '../../data/User';
import React, { useContext } from 'react';

import Home from '../Home/Home';
import Login from '../Login/Login';
import Video from '../Video/Video';
import Upload from '../Upload/Upload';
import Profile from '../Profile/Profile';
import Register from '../Register/Register';
import NotFound from '../NotFound/NotFound';
import Navigation from '../Navigation/Navigation';
import VideoEditor from '../VideoEditor/VideoEditor';

import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';

export default observer(p => {
  const userStore = useContext(UserStore);
  const accessToken = localStorage.getItem('accessToken');
  userStore.login(accessToken);

  return (
    <div>
      <Navigation {...p}>
        <Switch>
          <Route path='/' exact render={rp => <Home {...rp} {...p} />} />
          <Route path='/login' exact render={rp => <Login {...rp} {...p} />} />
          <Route path='/register' exact render={rp => <Register {...rp} {...p} />} />
          <Route path='/profile' exact render={rp => <Profile {...rp} {...p} />} />
          <Route path='/upload' exact render={rp => <Upload {...rp} {...p} />} />
          <Route
            path='/videos/:videoId'
            render={rp => <Video id={rp.match.params.videoId} {...rp} {...p} />}
          />
          <Route path='/editor/videos/:videoId' render={rp => <VideoEditor {...rp} {...p} />} />
          <Route path='*' render={rp => <NotFound {...rp} {...p} />} />
        </Switch>
      </Navigation>
    </div>
  );
});
