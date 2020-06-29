import React from 'react';

function App() {
  const outerDivStyle = {
    backgroundColor: '#000000',
    height: 'calc(100vh - 300px)',
    maxHeight: 'calc((9 / 16) * 100vw',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={outerDivStyle}>
        <video
          style={{ width: '100%' }}
          id='videoplayer'
          data-dashjs-player
          src='https://s3.us-east-2.wasabisys.com/dev-cdn.bken.io/dash/manifest.mpd'
          controls></video>
      </div>
    </div>
  );
}

export default App;
