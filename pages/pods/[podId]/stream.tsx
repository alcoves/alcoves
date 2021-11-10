import { Button, Flex } from '@chakra-ui/react'
import Layout from '../../../components/Layout'
import { useEffect } from 'react'

let peer

export default function Stream() {
  useEffect(() => {
    const fn = async () => {
      peer = (await import('peerjs')).default
      // set it to state here

      console.log(peer)

      // const conn = peer.connect('123')
      // // on open will be launch when you successfully connect to PeerServer
      // conn.on('open', function () {
      //   // here you have conn.id
      //   conn.send('hi!')
      // })

      // peer.on('connection', function (conn) {
      //   conn.on('data', function (data) {
      //     // Will print 'hi!'
      //     console.log(data)
      //   })
      // })
    }
    fn()
  }, [])

  function call() {
    const getUserMedia = window.navigator.mediaDevices.getUserMedia
    getUserMedia({ audio: true, video: true })
      .then(stream => {
        const call = peer.call('123', stream)
        call.on('stream', function (remoteStream) {
          // Show stream in some video/canvas element.
        })
      })
      .catch(error => {
        console.log('Failed to get local stream', error)
      })
  }

  function answer() {
    const getUserMedia = window.navigator.mediaDevices.getUserMedia
    getUserMedia({ audio: true, video: true })
      .then(stream => {
        call.answer(stream) // Answer the call with an A/V stream.
        call.on('stream', function (remoteStream) {
          // Show stream in some video/canvas element.
        })
      })
      .catch(error => {
        console.log('Failed to get local stream', error)
      })
  }

  return (
    <Layout>
      <Button onClick={call}>Call</Button>
      <Button onClick={answer}>Answer</Button>
      <Flex>Click to stream</Flex>
    </Layout>
  )
}
