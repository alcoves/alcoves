import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import UploadIcon from '@material-ui/icons/PublishOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import VideoLibraryIcon from '@material-ui/icons/VideoLibraryOutlined';
import Link from 'next/link';

import { Box, } from '@material-ui/core';
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
  // const { user } = useContext(UserContext);
  const user = null;

  return (
    <div>
      Navigation
    </div>
    // <GridCon container>
    //   <Grid item xs={2}>
    //     <LogoCon>
    //       <Link href='/'>
    //         {/* <Logo src={favicon} /> */}
    //       </Link>
    //     </LogoCon>
    //   </Grid>
    //   <Grid item xs>
    //     <Grid container justify='center'>
    //       {/* <SearchBar /> */}
    //     </Grid>
    //   </Grid>
    //   <Grid item xs={2} style={{ minWidth: '150px' }}>
    //     <Grid container justify='flex-end'>
    //       <Box>
    //         {user && (
    //           <IconButton component={Link} href='/upload' color='primary'>
    //             <UploadIcon />
    //           </IconButton>
    //         )}
    //       </Box>
    //       <Box>
    //         {user && user.id && (
    //           <IconButton component={Link} href='/editor' color='primary'>
    //             <VideoLibraryIcon />
    //           </IconButton>
    //         )}
    //       </Box>
    //       <Box>
    //         {user ? (
    //           <IconButton href='/account' component={Link} color='primary'>
    //             <PersonOutlinedIcon />
    //           </IconButton>
    //         ) : (
    //           <IconButton href='/login' component={Link} color='primary'>
    //             <PersonOutlinedIcon />
    //           </IconButton>
    //         )}
    //       </Box>
    //     </Grid>
    //   </Grid>
    // </GridCon>
  );
}
