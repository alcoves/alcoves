import qs from 'query-string';
import { gql, useLazyQuery, } from '@apollo/client';
import React, { createContext, useState, useEffect, } from 'react';
import { useHistory, } from 'react-router-dom';

const SEARCH = gql`
  query videos($title: String!) {
    videos(title: $title) {
      id
      title
      createdAt
      thumbnails
      user {
        username
      }
    }
  }
`;

export const SearchContext = createContext();

export default function SearchContextProvider({ children }) {
  const history = useHistory();
  const [search, setSearch] = useState(qs.parse(window.location.search).title);
  const [searchQuery, { data, error, loading }] = useLazyQuery(SEARCH, { variables: { title: search } });

  useEffect(() => {
    if (search) {
      history.push(`/search?title=${search}`);
      searchQuery();
    }
  }, [search]);

  return <SearchContext.Provider value={{ search, setSearch, data, error, loading }}>{children}</SearchContext.Provider>;
}
