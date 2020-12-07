import React, { useState, } from 'react';
import { Menu, MenuItem, IconButton, } from '@material-ui/core';
import Icon from '../Icon';

function QualitySelector({ hls }) {
  const [settingsEl, setSettingsEl] = useState(null);
  if (!hls?.levels?.length) return <div />;

  return (
    <div>
      <IconButton size='small' onClick={(e) => { setSettingsEl(e.currentTarget); }}>
        <Icon
          width={20}
          height={20}
          stroke='#fff'
          name='settings'
        />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={settingsEl}
        open={Boolean(settingsEl)}
        onClose={() => setSettingsEl(null)}
      >
        {hls.levels.map((l, i) => {
          return (
            <MenuItem
              key={l.name}
              onClick={() => {
                console.log('setting load level', i);
                hls.loadLevel = i;
                hls.startLoad();
                setSettingsEl(null);
              }}
              selected={hls.currentLevel === i}
            >
              {`${l.name}`}
            </MenuItem>
          );
        })}
        {/* <MenuItem
          onClick={() => {
            hls.currentLevel = -1;
            setSettingsEl(null);
          }}
        >
          Auto
        </MenuItem> */}
      </Menu>
    </div>
  );
}

export default QualitySelector;