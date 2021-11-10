import { Box, Flex } from '@chakra-ui/react'
import Layout from '../../../components/Layout'
import { useEffect } from 'react'

// import PeerJS from 'peerjs'
// const CHANNEL_ID = 'bken-123'
// let peer: PeerJS

const userMediaParams = { audio: { echoCancellation: true }, video: true }

export default function Stream() {
  function addVideoStream(video: any, stream: any) {
    video.srcObject = stream
    video.onloadedmetadata = function () {
      video.play()
    }
  }

  useEffect(() => {
    window?.navigator.mediaDevices.getUserMedia(userMediaParams).then(stream => {
      const myVideo = document.getElementById('my-video')
      addVideoStream(myVideo, stream)
    })

    // import('peerjs').then(({ default: Peer }) => {
    //   peer = new Peer(CHANNEL_ID)
    //   peer.on('open', function (id) {
    //     console.log('My peer ID is: ' + id)
    //   })

    //   window?.navigator.mediaDevices.getUserMedia(userMediaParams).then(stream => {
    //     const myVideo = document.getElementById('my-video')
    //     addVideoStream(myVideo, stream)
    //     peer.on('call', call => {
    //       call.answer(stream)
    //       const video = document.getElementById('video-1')
    //       call.on('stream', userVideoStream => {
    //         addVideoStream(video, userVideoStream)
    //       })
    //     })
    //   })
    // })
  }, [])

  return (
    <Layout>
      <Flex justify='center' mt='10' w='100%' h='100%'>
        <Box borderRadius='5px' width='800px'>
          <video width='805px' id='my-video' muted />
        </Box>
      </Flex>
    </Layout>
  )
}
