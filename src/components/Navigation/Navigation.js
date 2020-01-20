import UserStore from '../../data/User';
import React, { useContext } from 'react';
import SearchBar from '../SearchBar/SearchBar';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Icon, Menu, Sidebar } from 'semantic-ui-react';

export default observer(props => {
  const history = useHistory();
  const user = useContext(UserStore);

  const state = useObservable({
    visible: false,
  });

  const handleClick = e => {
    history.push(`/${e.currentTarget.id}`);
  };

  const styles = {
    menu: {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#efefef',
      justifyContent: 'space-between',
    },
    menuCol: {
      display: 'flex',
      minWidth: '160px',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50px',
      height: '50px',
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      height: '50px',
      width: '50px',
    },
  };

  return (
    <div>
      <div style={styles.menu}>
        <div style={styles.menuCol}>
          <div style={styles.logo}>
            <Icon
              name='bars'
              style={{ cursor: 'pointer' }}
              onClick={() => (state.visible = !state.visible)}
            />
          </div>
          <div style={styles.logo}>
            <img
              id=''
              style={{ cursor: 'pointer' }}
              height={35}
              src='https://bken.io/favicon.ico'
              onClick={handleClick}
            />
          </div>
        </div>
        <div style={styles.menuCol}>
          <SearchBar />
        </div>
        {user.isLoggedIn() ? (
          <div style={styles.menuCol}>
            <div style={styles.menuItem}>
              <Button circular id='upload' icon='upload' onClick={handleClick} />
            </div>
            <div style={styles.menuItem}>
              <Button circular id={`users/${user.id}`} icon='video' onClick={handleClick} />
            </div>
            <div style={styles.menuItem}>
              <Button
                circular
                id='account'
                onClick={handleClick}
                icon='user'
                onClick={handleClick}
              />
            </div>
          </div>
        ) : (
          <div style={styles.menuCol}>
            <div style={styles.menuItem}>
              <Button circular id='login' icon='user' onClick={handleClick} />
            </div>
          </div>
        )}
      </div>
      <Sidebar.Pushable style={{ height: 'calc(100vh - 50px)' }}>
        <Sidebar
          vertical
          as={Menu}
          icon='labeled'
          animation='overlay'
          onHide={() => (state.visible = false)}
          visible={state.visible}>
          <Menu.Item as='a' style={{ width: '200px' }}>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='gamepad' />
            Games
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <div>{props.children}</div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
});

// const SidebarNav = observer(() => {
//   const history = useHistory();
//   const state = useObservable({
//     followings: [],
//     loading: true,
//   });

//   const loadFollowings = async () => {
//     try {
//       api({
//         method: 'get',
//         url: `/followings`,
//       }).then(res => {
//         console.log(res.data.payload);
//         state.followings = res.data.payload;
//         state.loading = false;
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const styles = {
//     container: {
//       backgroundColor: '#171B24',
//       width: '200px',
//       height: 'calc(100vh - 50px)',
//     },
//   };

//   if (state.loading) {
//     loadFollowings();
//     return <div style={styles.container}> loading </div>;
//   } else {
//     return (
//       <div style={styles.container}>
//         <div style={{ paddingLeft: '10px' }}>
//           <h5>Following</h5>
//         </div>
//         {state.followings.map(following => {
//           console.log('following', following.followee.displayName);
//           return (
//             <div
//               onClick={() => {
//                 history.push(`/users/${following.followee._id}`);
//               }}
//               key={following._id}
//               className='followerMenuItem'>
//               <p>{following.followee.displayName}</p>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// });
