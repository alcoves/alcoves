import React from 'react';
import ReactPlayer from 'react-player';

export default () => {
  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <ReactPlayer
        width='100%'
        height='100%'
        controls={true}
        className='react-player'
        url={[
          { src: 'https://s3.us-east-2.wasabisys.com/media-bken/123/train.mp4', type: 'video/mp4' },
        ]}
      />
      <div style={{ padding: '10px' }}>
        {/* <img src='https://s3.us-east-2.wasabisys.com/media-bken/123/thumb.jpg' width='100%' /> */}
        <h3 style={{ color: 'white', padding: '5px' }}>
          {`This is a test of a title for a video that is really long so that we can test how long video titles.`}
        </h3>
      </div>
    </div>
  );
};
