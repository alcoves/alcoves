import moment from 'moment';
import React, { useContext } from 'react';
import { SearchContext } from '../contexts/SearchContext';
import { Container, LinearProgress, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function searchResults() {
  const { error, data, loading } = useContext(SearchContext);

  if (data) {
    return (
      <Container>
        <br />
        {data.videos.map((v) => {
          console.log('v', v);
          return <div key={v.id} style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginRight: '10px' }}>
              <Link to={`/v/${v.id}`}>
                <img style={{ width: 350, borderRadius: '3px' }} src={v.thumbnails[0]} />
              </Link>
            </div>
            <div>
              <Link to={`/v/${v.id}`} >
                <Typography variant="h4">{v.title}</Typography>
              </Link>
              <Typography variant="subtitle2">{moment(parseInt(v.createdAt)).fromNow()}</Typography>
              <Link to={`/v/${v.user.username}`} >
                <Typography variant="subtitle2">{v.user.username}</Typography>
              </Link>
            </div>
          </div>
        })}
      </Container>
    );
  }

  if (error) return <code> {JSON.stringify(error)} </code>

  if (loading) {
    return <LinearProgress />
  } else {
    return <div> No Results </div>
  }
}