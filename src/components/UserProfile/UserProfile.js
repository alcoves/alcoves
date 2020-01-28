import React from 'react';
import UserHeader from './UserHeader';
import UserVideoGrid from './UserVideoGrid';

export default props => {
  return (
    <div>
      <UserHeader {...props} />
      <UserVideoGrid {...props} />
    </div>
  );
};
