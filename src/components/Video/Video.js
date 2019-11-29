import React from 'react';

export default () => {
  return (
    <div style={{ border: 'solid black 1px', width: '320px', height: '270px' }}>
      <img src='https://s3.us-east-2.wasabisys.com/media-bken/123/thumb.jpg' width='100%' />
      <div style={{ color: 'white', padding: '5px' }}>
        {`This is a test of a title for a video that is really long so that we can test how long video titles.`}
      </div>
    </div>
  );
};
