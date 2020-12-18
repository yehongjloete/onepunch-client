import React, {useRef, useEffect} from 'react'
import type {FC, SyntheticEvent} from 'react'
import WaveSurfer from 'wavesurfer.js'
import videojs from 'video.js'
//import type {VideoTrack} from 'video.js'
import * as U from '../utils'
import * as D from '../data'
import {renderWave2} from '../svg'
import {useWaveUrl, useOnTimeUpdate} from '../hooks'

const home = false
const wav2_id = home ? '5fdb2335bcee7940f4475182' : '5fdab92d6d0a020d19ad0b8b'
const wav2_url = U.getUrl(`/getFile/${wav2_id}`)

const mp42_id = home ? '5fdb232bbcee7940f4474b8e' : '5fdab38e6d0a020d19acf7f3'
const vtt2_id = home ? '5fdb231cbcee7940f4474b8c' : '5fd9b0941970b441db90bd60'
const vtt2_url = U.getUrl(`/getFile/${vtt2_id}`)
const mp42_url = U.getUrl(`/getFile/${mp42_id}`)
const vtt2_json_url = U.getUrl(`/getVTT/${vtt2_id}`)

interface IVideoPlayerProps {
  options: videojs.PlayerOptions
}

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false
    }
  }
}

const centerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const VideoPlayer: FC<IVideoPlayerProps> = ({options}) => {
  const videoNode = React.useRef<HTMLVideoElement | null>(null)
  const player = React.useRef<videojs.Player>()

  useEffect(() => {
    player.current = videojs(videoNode.current, {
      ...initialOptions,
      ...options
    }).ready(function () {
      console.log('onPlayerReady', this)
    })

    return () => {
      if (player.current) {
        player.current.dispose()
      }
    }
  }, [options])
  const displayAudio = false
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const svgRef = useRef<SVGSVGElement | null>(null)
  const {onTimeUpdate, currentTime} = useOnTimeUpdate(audioRef, videoNode)

  const {length, duration, sampleRate, numberOfChannels, rawData} = useWaveUrl(
    wav2_url,
    svgRef,
    currentTime,
    renderWave2
  )
  const onProgress = () => {
    console.log('onProgress', videoNode.current?.currentTime)
  }

  const onError = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    console.log('onError', e)
  }
  const onSeeking = () => {
    console.log('onSeeking', videoNode.current?.currentTime)
  }
  return (
    <div>
      <h1>Video</h1>
      <div className="measure" style={centerStyle}>
        <p>length: {length} (rawData array length)</p>
        {displayAudio && <p>duration: {duration} seconds</p>}
        <p>duration: {duration / 60} minutes</p>
        <p>sampleRate: {sampleRate} in samples per second</p>
        <p>numberOfChannels: {numberOfChannels}</p>
        {displayAudio && <p>d: {rawData[length - 1]}</p>}
      </div>
      <video
        ref={videoNode}
        className="video-js"
        controls
        crossOrigin="anonymous"
        onSeeking={onSeeking}
        onError={onError}
        onProgress={onProgress}
        onTimeUpdate={onTimeUpdate}>
        <track
          src={vtt2_url}
          default
          kind="subtitles"
          label="English Subtitles"
          srcLang="en"
        />
      </video>
    </div>
  )
}

const videoJsOptions = {
  sources: [
    {
      //src: '//vjs.zencdn.net/v/oceans.mp4',
      src: mp42_url,
      type: 'video/mp4'
    }
  ]
}
export default function Video() {
  return <VideoPlayer options={videoJsOptions}></VideoPlayer>
}
