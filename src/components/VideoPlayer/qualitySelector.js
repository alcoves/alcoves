import React from 'react';
import { Menu, } from 'grommet';
import Icon from '../Icon';

function QualitySelector({ hls }) {
  function QualityIcon() {
    return (
      <Icon
        width={20}
        height={20}
        stroke='#fff'
        name='settings'
        cursor='pointer'
      />
    );
  }

  function handleLevel(i) {
    console.log('setting load level', i);
    hls.currentLevel = i;
  }

  if (!hls?.levels?.length) return <div />;

  return (
    <Menu
      icon={QualityIcon()}
      dropAlign={{ bottom: 'top', right: 'right' }}
      items={hls.levels.map((l, i) => ({ label: l.name, onClick: () => handleLevel(i) }))}
    />
  );
}



export default QualitySelector;