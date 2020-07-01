import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';

import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const Duration = styled.div`
  right: 0;
  bottom: 0;
  z-index: 0;
  color: white;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  border-radius: 3px;
  margin: 0px 3px 3px 0px;
  padding: 0px 3px 0px 3px;
  background: rgba(0, 0, 0, 0.7);
`;

function videoDuration(d) {
  if (d > 3600) {
    return moment.utc(d * 1000).format('H:mm:ss');
  } else {
    return moment.utc(d * 1000).format('m:ss');
  }
}

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

function VideoCard({ video, isEditor }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card className={classes.root}>
      <Link to={`/videos/${video.id}`}>
        <CardActionArea>
          <div
            style={{
              width: 500,
              cursor: 'pointer',
              minHeight: '180px',
              maxHeight: '180px',
              position: 'relative',
              backgroundColor: 'grey',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url("${video.thumbnail}")`,
              backgroundPosition: 'center',
            }}>
            <Duration>{videoDuration(video.duration)}</Duration>
          </div>
          <CardContent>
            <Typography gutterBottom variant='h6' noWrap>
              {video.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardHeader
        avatar={<Avatar aria-label='avatar' src={video.user.avatar} />}
        action={
          <div>
            <IconButton onClick={handleClick} aria-label='settings'>
              <MoreVertIcon />
            </IconButton>

            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              {isEditor && (
                <MenuItem onClick={handleClose} component={Link} to={`/editor/${video.id}`}>
                  Edit
                </MenuItem>
              )}
            </Menu>
          </div>
        }
        title={video.user.userName}
        subheader={video.createdAt}
      />
    </Card>
  );
}

export default function VideoGrid({ videos = [], isEditor }) {
  return (
    <Grid container spacing={2} justify='center' style={{ paddingTop: '30px' }}>
      {videos.map(video => {
        return (
          <Grid item key={video.id}>
            <VideoCard video={video} isEditor={isEditor} />
          </Grid>
        );
      })}
    </Grid>
  );
}
