import { Box, Text, Flex, Spinner, Progress, Checkbox } from '@chakra-ui/react'

import { Video } from '../../types/types'
import duration from '../../utils/duration'

export default function VideoItemSelect({
  v,
  toggleSelected,
}: {
  v: Video
  toggleSelected: (id: string) => void
}) {
  return (
    <Box key={v.id} cursor='pointer' position='relative'>
      <Flex
        p='1'
        w='100%'
        h='100%'
        direction='column'
        position='absolute'
        onClick={() => {
          toggleSelected(v.id)
        }}
        justify='space-between'
        boxShadow='-7px 2px 67px -115px rgba(0,0,0,0.75) inset'
        _hover={{ boxShadow: '-7px 2px 67px -25px rgba(0,0,0,0.75) inset' }}
      >
        <Flex justify='space-between'>
          <Flex align='center' bg='rgba(0,0,0,.6)' px='1' py='.5' rounded='md'>
            <Text fontSize='.8rem' fontWeight='800' color='#ffffff'>
              {duration(v.length)}
            </Text>
          </Flex>
          <Flex>
            <Checkbox colorScheme='blue' isChecked={v.selected} />
          </Flex>
        </Flex>
        <Flex align='center' direction='column'>
          {v.status !== 'READY' && (
            <>
              <Spinner />
              <Progress mt='2' h='4px' w='100px' value={v.progress} />
              <Text fontWeight='700'>{v.status}</Text>
            </>
          )}
          {v.status === 'ERROR' && (
            <Text fontWeight='700' color='red.500'>
              {v.status}
            </Text>
          )}
        </Flex>
        <Flex />
      </Flex>
      <Box
        w='100%'
        h='200px'
        rounded='md'
        backgroundSize='cover'
        backgroundColor='black'
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundImage={v.thumbnailUrl ? v.thumbnailUrl : ''}
      />
    </Box>
  )
}
