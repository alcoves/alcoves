import Image from 'next/image';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import UploadIcon from '@material-ui/icons/PublishOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import VideoLibraryIcon from '@material-ui/icons/VideoLibraryOutlined';
import Link from 'next/link';

import { Box, Typography, } from '@material-ui/core';
// import favicon from '../public/favicon.ico';
// import SearchBar from './SearchBar';
// import { UserContext, } from '../contexts/userContext';

const GridCon = styled(Grid)`
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #23272a;
  justify-content: space-between;
`;

const LogoCon = styled.div`
  width: 100px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
`;

export default function Navigation() {
  // const { user } = useContext(UserContext);
  const user = null;

  return (
    <GridCon container>
      <Grid item xs={2}>
        <LogoCon>
          <Logo>
            <Image
              alt='logo'
              width={40}
              height={40}
              src='/logo.png'
            />
          </Logo>
          <Link href='/'>
            <Typography variant='subtitle2'>Home</Typography>
          </Link>
        </LogoCon>
      </Grid>
      <Grid item xs>
        <Grid container justify='center'>
          {/* <SearchBar /> */}
        </Grid>
      </Grid>
      <Grid item xs={2} style={{ minWidth: '150px' }}>
        <Grid container justify='flex-end'>
          <Box>
            {user && (
              <Link href='/upload' passHref>
                <IconButton color='primary'>
                  <UploadIcon />
                </IconButton>
              </Link>
            )}
          </Box>
          <Box>
            {user && user.id && (
              <Link href='/editor' passHref>
                <IconButton color='primary'>
                  <VideoLibraryIcon />
                </IconButton>
              </Link>
            )}
          </Box>
          <Box>
            {user ? (
              <Link href='/account' passHref>
                <IconButton color='primary'>
                  <PersonOutlinedIcon />
                </IconButton>
              </Link>
            ) : (
              <Link href='/login' passHref>
                <IconButton color='primary'>
                  <PersonOutlinedIcon />
                </IconButton>
              </Link>
            )}
          </Box>
        </Grid>
      </Grid>
    </GridCon>
  );
}
