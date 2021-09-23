import { Menu, MenuItem, MenuButton, MenuList, Text, IconButton } from '@chakra-ui/react'
import { IoSettingsOutline } from 'react-icons/io5'

function QualitySelector({ hls }) {
  const levels = hls?.levels
  const abrEnabled = hls?.autoLevelEnabled

  if (!levels) {
    return null
  }

  return (
    <Menu placement='top'>
      <MenuButton
        size='sm'
        as={IconButton}
        variant='ghost'
        icon={<IoSettingsOutline size='20px' />}
      />
      <MenuList>
        {levels.map(level => {
          const menuText = `${level.height}p`
          return (
            <MenuItem
              key={level.id}
              value={level.id}
              onClick={() => {
                // Set level to specific level
                // Disable automatic switching
                // console.log('setting level', level.height)
                // const config = { abr: { enabled: false } }
                // player.configure(config)
                // player.selectVariantTrack(level, true)
              }}
            >
              <Text fontSize='.85rem' fontWeight={level.active ? 800 : 400}>
                {menuText}
              </Text>
            </MenuItem>
          )
        })}
        <MenuItem
          key='auto'
          value='Auto'
          onClick={() => {
            // Enable autoamtic switching
            // const config = { abr: { enabled: true } }
            // player.configure(config)
          }}
        >
          <Text fontSize='.85rem' fontWeight={abrEnabled ? 800 : 400}>
            Auto
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default QualitySelector
