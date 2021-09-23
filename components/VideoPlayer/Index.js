import Hls from 'hls.js'
import React, { useRef, useState, useEffect } from 'react'
import qs from 'query-string'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import screenfull from 'screenfull'
import Scrubber from './Scrubber'
import Duration from './Duration'
import PlayButton from './PlayButton'
import VolumeSlider from './VolumeSlider'
import VolumeButton from './VolumeButton'
import QualitySelector from './QualitySelector'
import FullScreenButton from './FullScreenButton'
import PictureInPictureButton from './PictureInPictureButton'

let idleTimer
let clickTimer

function VideoPlayer({ theaterMode, thumbnail, url, id = 'bkenVideoPlayer' }) {
  const vRef = useRef(null)
  const cRef = useRef(null)
  const [hls, setHls] = useState(null)
  const [controlsVisible, setControlsVisible] = useState(true)

  function baseStyles() {
    if (theaterMode) {
      return {
        width: '100%',
        minHeight: '320px',
        height: 'calc((9 / 16) * 100vw)',
        maxHeight: 'calc(100vh - 200px)',
      }
    }
    return {
      width: '100%',
      height: '100%',
    }
  }

  useEffect(() => {
    let hls
    if (vRef?.current) {
      const video = vRef?.current

      if (!url.includes('.m3u8') || video.canPlayType('application/vnd.apple.mpegurl')) {
        // Play original fallback or native m3u8 support
        video.src = url
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls({
          capLevelToPlayerSize: true,
        })
        hls.loadSource(url)
        hls.attachMedia(video)
        setHls(hls)
        setControlsVisible(true)
      } else {
        console.error("This is a legacy browser that doesn't support MSE")
      }
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [vRef, url])

  function togglePlay() {
    if (vRef && vRef.current) {
      const r = vRef.current
      r.paused ? r.play() : r.pause()
    }
  }

  useEffect(() => {
    function onKeydown(e) {
      if (e.code === 'Space') togglePlay()
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  })

  console.log(controlsVisible)

  function controlHover() {
    clearTimeout(idleTimer)
    if (!controlsVisible) setControlsVisible(true)

    idleTimer = setTimeout(() => {
      if (!vRef?.current?.paused) {
        if (vRef?.current?.networkState === vRef?.current?.NETWORK_LOADING) {
          // The user agent is actively trying to download data.
          setControlsVisible(true)
        }
        if (vRef?.current?.readyState < vRef?.current?.HAVE_FUTURE_DATA) {
          // There is not enough data to keep playing from this point
          setControlsVisible(true)
        }
      }
    }, 2000)
  }

  function renderCenter() {
    if (vRef?.current?.currentTime < 1) {
      return (
        <PlayButton
          size='40px'
          vRef={vRef}
          color='#eee'
          chakraProps={{
            variant: 'ghost',
            rounded: 'xl',
            h: '100%',
            p: '10px',
          }}
        />
      )
    }
    // if (vRef.current.networkState === vRef?.current?.NETWORK_LOADING) {
    //   return <Spinner size='xl' color='#bf1e2e' />
    // }
    return <div />
  }

  function toggleFullScreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle(cRef?.current)
    }
  }

  return (
    <Box
      ref={cRef}
      onMouseMove={controlHover}
      onTouchStart={controlHover}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => {
        if (!vRef?.current.paused) {
          // TODO :: keep controls visible if buffering
          setControlsVisible(false)
        }
      }}
      pos='relative'
      backgroundColor='rgba(0,0,0,.3)'
      cursor={`${controlsVisible ? 'auto' : 'none'}`}
      {...baseStyles()}
    >
      <video
        id={id}
        muted
        autoPlay
        ref={vRef}
        playsInline
        poster={thumbnail}
        disableRemotePlayback
        style={{
          width: '100%',
          height: '100%',
          background: 'black',
        }}
      />

      {Boolean(vRef.current) ? (
        <Flex
          top='0'
          left='0'
          w='100%'
          h='100%'
          overflow='none'
          position='absolute'
          alignItems='center'
          flexDirection='column'
          justifyContent='flex-end'
          background='rgb(255,255,255)'
          transition='opacity .1s ease-in'
          opacity={`${controlsVisible ? 1 : 0}`}
          // eslint-disable-next-line
          background='linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.30) 90%, rgba(0,0,0,0.60) 100%)'>
          <Flex
            w='100%'
            h='100%'
            flexDirection='column'
            justify='center'
            align='center'
            onClick={e => {
              clearTimeout(clickTimer)
              if (e.detail === 1) {
                clickTimer = setTimeout(() => {
                  togglePlay()
                }, 200)
              } else if (e.detail === 2) {
                clearTimeout(clickTimer)
                toggleFullScreen()
              }
              e.preventDefault()
            }}
          >
            <Box> {renderCenter()} </Box>
          </Flex>
          <Flex w='100%' direction='column' px='2'>
            <Scrubber vRef={vRef} />
            <Flex w='100%' justifyContent='space-between' alignContent='end'>
              <Flex alignItems='center'>
                <PlayButton vRef={vRef} />
                <VolumeButton vRef={vRef} />
                <VolumeSlider vRef={vRef} />
                <Duration vRef={vRef} />
              </Flex>
              <Flex alignItems='center'>
                <QualitySelector hls={hls} />
                <Flex alignItems='center'>
                  <PictureInPictureButton vRef={vRef} />
                  <FullScreenButton toggle={toggleFullScreen} />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ) : null}
    </Box>
  )
}

export default VideoPlayer
