import { FaCopy } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { IoCheckmark } from 'react-icons/io5'
import {
  Box,
  Text,
  Flex,
  Input,
  Tooltip,
  InputGroup,
  IconButton,
  InputRightElement,
} from '@chakra-ui/react'

export default function InputUpdate({
  text,
  label,
}: {
  text: string
  label?: string
}) {
  const [icon, setIcon] = useState(<FaCopy />)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setIcon(
      <Box color="green.500">
        <IoCheckmark color="inherit" />
      </Box>
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => setIcon(<FaCopy />), 2000)
    return () => clearTimeout(timer)
  }, [icon])

  return (
    <Flex justify="start" direction="column" w="100%">
      {label && <Text pb="1">{label}</Text>}
      <InputGroup size="md">
        <Input
          size="sm"
          rounded="md"
          value={text}
          cursor="pointer"
          variant="filled"
          fontFamily="mono"
          fontSize=".75rem"
          isReadOnly={true}
          onClick={handleCopy}
        />
        <InputRightElement h="100%">
          <Tooltip label="Copy to clipboard">
            <IconButton
              size="xs"
              icon={icon}
              variant="ghost"
              aria-label="copy"
              onClick={handleCopy}
            />
          </Tooltip>
        </InputRightElement>
      </InputGroup>
    </Flex>
  )
}
