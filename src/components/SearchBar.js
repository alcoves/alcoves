import styled from 'styled-components';
import React, { useContext, useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { SearchContext } from '../contexts/SearchContext';

const SearchBox = styled(InputBase)`
  width: 100%;
  height: 30px;
  max-width: 400px;
  border-radius: 3px;
  background-color: #2f3438;
  font-size: .9em !important;
  padding: 0px 10px 0px 10px;
`;

export default function search() {
  const { search, setSearch } = useContext(SearchContext);
  const [localSearch, setLocalSearch] = useState(search);

  return <SearchBox
    value={localSearch}
    placeholder='Search'
    onChange={(e) => { setLocalSearch(e.target.value) }}
    onKeyPress={(e) => { if (e.key === 'Enter') { setSearch(e.target.value) } }} />
}