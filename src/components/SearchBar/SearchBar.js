import React from 'react';

import { Input } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Redirect } from 'react-router-dom';

export default observer(() => {
  const handleChange = e => {
    if (e.key === 'Enter') {
      return <Redirect to={`/search?resource=videos&text=${e.target.value}`} />;
    }
  };

  return null;
  return (
    <Input
      style={{ maxWidth: '500px', minWidth: '100px' }}
      onKeyDown={handleChange}
      size='small'
      placeholder='Search'
      icon='search'
    />
  );
});
