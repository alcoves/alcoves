import { Moon, Sun } from 'lucide-react'
import { IconButton, useColorMode } from '@chakra-ui/react'

export default function ColorModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <IconButton
            aria-label="Theme"
            onClick={toggleColorMode}
            icon={
                colorMode === 'light' ? (
                    <Moon size="1rem" />
                ) : (
                    <Sun size="1rem" />
                )
            }
        />
    )
}
