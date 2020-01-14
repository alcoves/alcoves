import React from 'react';

import { Input } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

export default observer(() => {
  const history = useHistory();

  const handleChange = e => {
    if (e.key === 'Enter') {
      history.push(`/search/?resource=users&text=${e.target.value}`);
    }
  };

  return <Input onKeyDown={handleChange} size='small' placeholder='Search' icon='search' />;
});
