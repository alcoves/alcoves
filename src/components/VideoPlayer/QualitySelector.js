import {
  Menu, MenuItem, MenuButton, MenuList, Text, IconButton, 
} from '@chakra-ui/react';
import { IoSettingsOutline, } from 'react-icons/io5';

function QualitySelector({ player }) {
  const tracks = player?.getVariantTracks();
  // const selectedTrack = tracks.find((track) => track.active);
  const abrEnabled = player.getConfiguration().abr.enabled;

  return (
    <Menu placement='top'>
      <MenuButton
        size='sm'
        as={IconButton}
        variant='ghost'
        icon={<IoSettingsOutline size='20px' />}
      />
      <MenuList>
        {tracks.map((track) => {
          const menuText = `${track.height}p${track.frameRate}fps`;
          return (
            <MenuItem
              key={track.id}
              value={track.id}
              onClick={() => {
                console.log('setting track', track.height);
                const config = { abr: { enabled: false } };
                player.configure(config);
                player.selectVariantTrack(track, true);
              }}
            >
              <Text fontSize='.85rem' fontWeight={track.active ? 800 : 400}>
                {menuText}
              </Text>
            </MenuItem>
          );
        })}
        <MenuItem
          key='auto'
          value='Auto'
          onClick={() => {
            const config = { abr: { enabled: true } };
            player.configure(config);
          }}
        >
          <Text fontSize='.85rem' fontWeight={abrEnabled ? 800 : 400}>
            Auto
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default QualitySelector;