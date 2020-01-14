import React from 'react';
import api from '../../api/api';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(props => {
  const history = useHistory();
  const state = useObservable({
    loading: true,
    results: [],
  });

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
          return (
            <div key={result._id}>
              <a href={`/users/${result._id}`}>{result.userName}</a>
            </div>
          );
        })}
      </div>
    );
  }
});
