import React, { useState, } from 'react';
import { SettingsOutlined, } from '@material-ui/icons';
import { Menu, MenuItem, IconButton, } from '@material-ui/core';

function QualitySelector({ vRef, versions }) {
  const [settingsEl, setSettingsEl] = useState(null);

  return (
    <div>
      <IconButton size='small' onClick={(e) => { setSettingsEl(e.currentTarget); }}>
        <SettingsOutlined />
      </IconButton>
      <Menu
        keepMounted
        id='version-selector'
        anchorEl={settingsEl}
        open={Boolean(settingsEl)}
        onClose={() => setSettingsEl(null)}
      >
        {versions.filter(({ link }) => link).map((v) => (
          <MenuItem
            key={v.preset}
            selected={v.link === vRef.current.src}
            onClick={() => {
              const { currentTime } = vRef.current;
              vRef.current.src = v.link;
              vRef.current.currentTime = currentTime;
              vRef.current.play();
              setSettingsEl(null);
            }}
          >
            {v.preset.split('-')[1]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
 
}

export default QualitySelector;