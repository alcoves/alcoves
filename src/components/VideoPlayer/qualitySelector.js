import { Menu, MenuItem, IconButton, MenuButton, MenuList, } from '@chakra-ui/react';
import { IoSettingsOutline, } from 'react-icons/io5';

function QualitySelector({ player }) {
  const videoLevels = player.getBitrateInfoListFor && player.getBitrateInfoListFor('video') || [];
  const currentLevel = player.getQualityFor && player.getQualityFor('video');
  const currentSettings = player.getSettings && player.getSettings();

  return (
    <Menu placement='top'>
      <MenuButton as={IconButton} rounded='md' size='xs' variant='unstyled'>
        <IoSettingsOutline size='20px'/>
      </MenuButton>
      <MenuList>
        {videoLevels.map((l) => (
          <MenuItem
            py='4'
            key={l.qualityIndex} value={l.qualityIndex}
            onClick={() => {
              console.log('setting quality to', l.height);
              player.setQualityFor('video', l.qualityIndex);
              player.updateSettings({
                streaming: {
                  abr: {
                    autoSwitchBitrate: { video: false, audio: false },
                  },
                },
              });
              console.log('Settings:', player.getSettings());
            }}
          >
            {currentLevel === l.qualityIndex ? <b>{`${l.height}p`}</b> : <p>{`${l.height}p`}</p> }
          </MenuItem>
        ))}
        <MenuItem
          key='auto' value='Auto' py='4'
          onClick={() => {
            player.updateSettings({
              streaming: {
                abr: {
                  autoSwitchBitrate: { video: true, audio: true },
                },
              },
            });
            console.log('AutoPlay Enabled, Settings: ', player.getSettings());
          }}
        >
          {currentSettings?.streaming?.abr?.autoSwitchBitrate?.video ? <b>Auto</b> : <p>Auto</p>}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default QualitySelector;