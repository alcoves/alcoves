import { Menu, MenuItem, Button, MenuButton, MenuList, Text, } from '@chakra-ui/react';
import { IoSettingsOutline, } from 'react-icons/io5';

function QualitySelector({ player }) {
  const tracks = player?.getVariantTracks();
  const selectedTrack = tracks.find((track) => track.active);
  const abrEnabled = player.getConfiguration().abr.enabled;

  function renderCurrentQuality() {
    const currentTrackText = selectedTrack?.height ? `${selectedTrack?.height}p` : '';
    if (abrEnabled) {
      return <Text fontSize='xs'>Auto {currentTrackText}</Text>;
    } return <Text fontSize='xs'>{currentTrackText}</Text>;
  }

  return (
    <Menu placement='top'>
      <MenuButton
        size='sm'
        as={Button}
        variant='ghost'
        rounded='none'
        rightIcon={<IoSettingsOutline size='20px'/>}
      >
        {renderCurrentQuality()}
      </MenuButton>
      <MenuList>
        {tracks.map((track) => {
          const menuText = `${track.height}p${track.frameRate}fps`;

          return (
            <MenuItem
              py='4'
              key={track.id} value={track.id}
              onClick={() => {
                console.log('setting track', track.height);
                const config = { abr: { enabled: false } };
                player.configure(config);
                player.selectVariantTrack(track, true);
              }}
            >
              {track.active ? <b>{menuText}</b> : <p>{menuText}</p>}
            </MenuItem>
          );
        })}
        <MenuItem
          key='auto' value='Auto' py='4'
          onClick={() => {
            const config = { abr: { enabled: true } };
            player.configure(config);
          }}
        >
          {abrEnabled ? <b>Auto</b> : <p>Auto</p>}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default QualitySelector;