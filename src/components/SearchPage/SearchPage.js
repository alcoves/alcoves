import React from 'react';
import api from '../../api/api';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

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
      <div>
        Search Results
        {state.results.map(result => {
          console.log(JSON.stringify(result, null, 2));
          if (state.resource === 'videos') {
            return (
              <div key={result._id}>
                <a href={`/videos/${result._id}`}>{result.title}</a>
              </div>
            );
          } else if (state.resource === 'users') {
            return (
              <div key={result._id}>
                <a href={`/users/${result._id}`}>{result.displayName}</a>
              </div>
            );
          }
        })}
      </div>
    );
  }
});
