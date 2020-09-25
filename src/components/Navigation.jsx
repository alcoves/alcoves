import styled from 'styled-components';
import React, { useContext, } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import UploadIcon from '@material-ui/icons/PublishOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import VideoLibraryIcon from '@material-ui/icons/VideoLibraryOutlined';
import { Link, } from 'react-router-dom';
import { Box, } from '@material-ui/core';
import favicon from '../../public/favicon.ico';
import SearchBar from './SearchBar';
import { UserContext, } from '../contexts/UserContext';

const GridCon = styled(Grid)`
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #23272a;
  justify-content: space-between;
`;

const LogoCon = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

export default function Navigation() {
  const { user } = useContext(UserContext);

  return (
    <GridCon container>
      <Grid item xs={2}>
        <LogoCon>
          <Link to='/'>
            <Logo src={favicon} />
          </Link>
        </LogoCon>
      </Grid>
      <Grid item xs>
        <Grid container justify='center'>
          <SearchBar />
        </Grid>
      </Grid>
      <Grid item xs={2} style={{ minWidth: '150px' }}>
        <Grid container justify='flex-end'>
          <Box>
            {user && (
              <IconButton component={Link} to='/upload' color='primary'>
                <UploadIcon />
              </IconButton>
            )}
          </Box>
          <Box>
            {user && user.id && (
              <IconButton component={Link} to={`/u/${user.username}`} color='primary'>
                <VideoLibraryIcon />
              </IconButton>
            )}
          </Box>
          <Box>
            {user ? (
              <IconButton to='/account' component={Link} color='primary'>
                <PersonOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton to='/login' component={Link} color='primary'>
                <PersonOutlinedIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </GridCon>
  );
}
