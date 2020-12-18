import React, { useState, } from 'react';
import { Text, Menu, Popover, } from 'evergreen-ui';
import Icon from '../Icon';

function QualitySelector({ hls }) {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!open);
  }

  if (!hls?.levels?.length) return <div />;

  return (
    <Popover
      isShown={open}
      position='top'
      content={(
        <Menu>
          <Menu.Group>
            {hls.levels.map((l, i) => (
              <Menu.Item
                value={i}
                key={l.name}
                onSelect={() => {
                  console.log('setting load level', i);
                  hls.currentLevel = i;
                  setOpen(false);
                }}
              >
                <Text fontWeight={hls.currentLevel === i ? 500 : 300}>
                  {l.name}
                </Text>
              </Menu.Item>
            ))}
            <Menu.Item onSelect={() =>{
              hls.currentLevel = -1;
              setOpen(false);
            }}
            >
              Auto
            </Menu.Item>
          </Menu.Group>
        </Menu>
      )}
    >
      <div>
        <Icon
          width={20}
          height={20}
          stroke='#fff'
          name='settings'
          cursor='pointer'
          onClick={toggleOpen}
        />
      </div>
    </Popover>
  );
}

export default QualitySelector;