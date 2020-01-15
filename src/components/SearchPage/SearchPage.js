import React from 'react';
import api from '../../api/api';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

const styles = {
  card: {
    width: '100%',
    maxWidth: '500px',
    padding: '10px',
    margin: '5px 0px 5px 0px',
    borderRadius: '5px',
    backgroundColor: '#272d3c',
    color: 'white',
    overflow: 'hidden',
    WebkitBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    MozBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    boxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
  },
};

export default observer(props => {
  const history = useHistory();
  const state = useObservable({
    loading: true,
    resource: props.location.search.split('resource=')[1].split('&')[0],
    results: [],
  });

  console.log(props);

  const search = async () => {
    try {
      const res = await api({
        method: 'get',
        url: `/search${props.location.search}`,
      });

      state.results = res.data.payload;
      state.loading = false;
    } catch (error) {
      console.error(error);
    }
  };

  if (state.loading) {
    search();
    return null;
  } else {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px',
          // border: 'solid red 1px',
        }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '2em',
            textTransform: 'uppercase',
            maxWidth: '500px',
            width: '100%',
            marginTop: '25px',
            color: '#efefef',
            // border: 'solid red 1px',
          }}>
          Results
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1em',
            textTransform: 'uppercase',
            maxWidth: '500px',
            width: '100%',
            marginTop: '5px',
            marginBottom: '10px',
          }}>
          {state.resource}
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: '500px',
            width: '100%',
            flexDirection: 'column',
          }}>
          {state.results.map(result => {
            console.log(JSON.stringify(result, null, 2));
            if (state.resource === 'videos') {
              return (
                <div key={result._id} style={styles.card}>
                  <a href={`/videos/${result._id}`}>{result.title}</a>
                  <p>{result.user.displayName}</p>
                </div>
              );
            } else if (state.resource === 'users') {
              return (
                <div key={result._id} style={styles.card}>
                  <a href={`/users/${result._id}`}>{result.displayName}</a>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
});
