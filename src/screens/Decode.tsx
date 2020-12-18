import React, {useRef, useEffect, useState} from 'react'
import type {SyntheticEvent} from 'react'
import videojs from 'video.js'
import WaveSurfer from 'wavesurfer.js'
//import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js'

//import Cursor from 'wavesurfer.js/dist/plugin/cursor'
import * as U from '../utils'
import {renderWave2} from '../svg'
import {useWaveUrl, useOnTimeUpdate} from '../hooks'
import * as D from '../data'

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
export default function Decode() {
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const displayAudio = false
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const {onTimeUpdate, currentTime} = useOnTimeUpdate(audioRef, videoRef)

  const player = React.useRef<videojs.Player>()

  const {length, duration, sampleRate, numberOfChannels, rawData} = useWaveUrl(
    wav2_url,
    svgRef,
    currentTime,
    renderWave2
  )
  const [vttJson, setVttJson] = useState<D.IWebVTTNodeData[]>([])

  //console.log(vttJson)
  useEffect(() => {
    fetch(vtt2_json_url)
      .then((res) => res.json())
      .then(setVttJson)
      .catch((e) => console.log(e.message))
  }, [])

  // useEffect(() => {
  //   try {
  //     if (length) {
  //       videoRef.current?.play()
  //     }
  //   } catch (e) {}
  // }, [length, videoRef.current])

  const onProgress = () => {
    console.log('onProgress', videoRef.current?.currentTime)
  }

  const onError = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    console.log('onError', e)
  }
  const onSeeking = () => {
    console.log('onSeeking', videoRef.current?.currentTime)
  }
  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        barWidth: 2,
        barHeight: 1
        //barGap: null,
        // plugins: [
        //   WaveSurfer.timeline.create({
        //     container: '#timeline'
        // })
        // wavesurfer.addPlugin(WaveSurfer.timeline.create({ container: '#wave-timeline' })).initPlugin('timeline')
        // WaveSurfer.WaveSurferPlugin.create()
        // WaveSurfer.regions.create()
        // WaveSurfer.cursor.create({
        //     showTime: true,
        //     opacity: 1,
        //     customShowTimeStyle: {
        //         'background-color': '#000',
        //         color: '#fff',
        //         padding: '2px',
        //         'font-size': '10px'
        //     }
        // })
        // ]
      })
      const wavesurfer = wavesurferRef.current
      //const a = wavesurfer.initPlugin('minmap')
      //console.log('a', a)
      //WaveSurfer.minimap()
      const p = wavesurfer.getActivePlugins()
      console.log('p', p)
      wavesurfer.on('ready', function () {
        wavesurfer.play()
      })
      wavesurfer.load(mp42_url)
    }

    return () => wavesurferRef.current?.destroy()
  }, [waveformRef.current])

  return (
    <div>
      <h1>Decode</h1>
      <div className="measure" style={centerStyle}>
        <p>length: {length} (rawData array length)</p>
        {displayAudio && <p>duration: {duration} seconds</p>}
        <p>duration: {duration / 60} minutes</p>
        <p>sampleRate: {sampleRate} in samples per second</p>
        <p>numberOfChannels: {numberOfChannels}</p>
        {displayAudio && <p>d: {rawData[length - 1]}</p>}
      </div>

      <div ref={waveformRef} />
      <div className="video-container">
        {length && (
          <video
            className="video-js"
            playsInline
            ref={videoRef}
            controls
            controlsList="nodownload nofullscreen noremoteplayback"
            crossOrigin="anonymous"
            onSeeking={onSeeking}
            onError={onError}
            onProgress={onProgress}
            onTimeUpdate={onTimeUpdate}>
            <source src={mp42_url} type="video/mp4" />
            <track
              src={vtt2_url}
              default
              kind="subtitles"
              label="English Subtitles"
              srcLang="en"
            />
          </video>
        )}
      </div>
    </div>
  )
}
/*


      <canvas />
      <p></p>
      
      */
