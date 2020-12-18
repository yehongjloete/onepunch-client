import React, {useRef, useEffect, useState} from 'react'
import type {SyntheticEvent} from 'react'
import * as U from '../utils'
import {renderWave} from '../svg'
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

export default function D3Page() {
  const displayAudio = false
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const {onTimeUpdate, currentTime} = useOnTimeUpdate(audioRef, videoRef)
  console.log(currentTime)
  const {
    audioCtx,
    source,
    length,
    duration,
    sampleRate,
    numberOfChannels,
    rawData
  } = useWaveUrl(wav2_url, svgRef, currentTime, renderWave)
  const [vttJson, setVttJson] = useState<D.IWebVTTNodeData[]>([])

  console.log(vttJson)
  useEffect(() => {
    fetch(vtt2_json_url)
      .then((res) => res.json())
      .then(setVttJson)
      .catch((e) => console.log(e.message))
  }, [])

  useEffect(() => {
    try {
      if (length) {
        videoRef.current?.play()
      }
    } catch (e) {}
  }, [length, videoRef.current])

  const start = () => {
    console.log('start clicked')
    if (source) {
      source.start()
    }
  }
  const stop = () => {
    console.log('stop clicked')
    if (source) {
      //source.stop()
    }
  }
  const pause = () => {
    console.log('pause clicked')
    if (source) {
      audioCtx.suspend()
    }
  }
  const resume = () => {
    console.log('resume clicked')
    if (source) {
      audioCtx.resume()
    }
  }

  const onPlay = () => {
    console.log('onPlay', audioRef.current?.duration)
  }
  const onPause = () => {
    console.log('onPause')
  }
  const onWaiting = () => {
    console.log('onWaiting')
  }
  const onPlaying = () => {
    console.log('onPlaying', audioRef.current?.duration)
  }
  const onEnded = () => {
    console.log('onEnded')
  }
  const onDurationChange = () => {
    console.log('onDurationChange', audioRef.current?.duration)
  }
  // const onTimeUpdate = () => {
  //   console.log('onTimeUpdate', audioRef.current?.currentTime)
  // }
  const onProgress = () => {
    console.log('onProgress')
  }
  const onRateChange = () => {
    console.log('onRateChange', audioRef.current?.duration)
  }
  const onError = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    console.log('onError', e)
  }
  const onSeeking = () => {
    console.log('onSeeking')
  }
  const onLoad = () => {
    console.log('onLoad')
  }
  const onLoadData = () => {
    console.log('onLoadData')
  }
  const onLoadMetadata = () => {
    console.log('onLoadMetadata')
  }
  return (
    <div>
      <h1>D3Page</h1>
      <div className="measure">
        <p>length: {length} (rawData array length)</p>
        {displayAudio && <p>duration: {duration} seconds</p>}
        <p>duration: {duration / 60} minutes</p>
        <p>sampleRate: {sampleRate} in samples per second</p>
        <p>numberOfChannels: {numberOfChannels}</p>
        {displayAudio && <p>d: {rawData[length - 1]}</p>}
      </div>

      <canvas />
      <p></p>
      {length && (
        <video
          ref={videoRef}
          controls
          crossOrigin="anonymous"
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
      {<p>{JSON.stringify(vttJson, null, 2)}</p>}
      {displayAudio && (
        <div>
          <button onClick={start}>start</button>
          <button onClick={stop}>stop</button>
          <button onClick={pause}>pause</button>
          <button onClick={resume}>resume</button>
        </div>
      )}

      {displayAudio && (
        <audio
          ref={audioRef}
          controls
          crossOrigin="anonymous"
          onPlay={onPlay}
          onPause={onPause}
          onWaiting={onWaiting}
          onPlaying={onPlaying}
          onEnded={onEnded}
          onDurationChange={onDurationChange}
          onTimeUpdate={onTimeUpdate}
          onProgress={onProgress}
          onRateChange={onRateChange}
          onError={onError}
          onLoad={onLoad}
          onLoadedData={onLoadData}
          onLoadedMetadata={onLoadMetadata}
          onSeeking={onSeeking}>
          <source src={wav2_url} type="audio/wav" />
        </audio>
      )}
      <svg ref={svgRef} />
    </div>
  )
}
// <source src={wav2_url} type="audio/wav" />
/*
<template>
  <div class="wave-box border rounded" ref="scroll">
    <svg :width="width" :height="height">
      <g v-if="audioLoaded">
        <g v-if="tableLoaded">
          <rect v-for="(item, index) in subtitle" 
            :key="item.id" 
            :id="index"
            class="section" 
            :class="{ active: selected === index }"
            :x="getXScale(item.start)" 
            y="0" 
            :width="getXScale(item.end-item.start)" 
            :height="height"
            ref="selection"
          ></rect>
          <g>{{getInteract()}}</g>
        </g>
        <path 
          class="line-path" 
          :d="getWave"
        ></path>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import interact from 'interactjs';

export default {
  name: 'WaveBox',
  props: {

  },
  data() {
    return {
      // width: 1024,
      height: 320,
      selected: null,
    }
  },
  computed: {
    width: function() {
      return this.$store.state.audioEnd / 10;
    },
    getIndex: function() {
      return this.$store.state.index;
    },
    audioLoaded: function() {
      return this.$store.state.audioLoaded;
    },
    tableLoaded: function() {
      return this.$store.state.tableLoaded;
    },
    subtitle: function() {
      return this.$store.state.subtitle;
    },
    getWave: function() {      
      // Build X, Y value
      // const xValue = (d, i) => i;
      // const yValue = (d, i) => d;

      // Build X, Y Scale
      // const xScale = d3.scaleLinear()
      //       .domain(d3.extent(data, xValue))
      //       .range([0, this.width])
      //       .nice();
      const data = this.$store.state.audioData.audioD3Data;
      
      var maxVal = d3.max(data, d => d);
      const yScale = d3.scaleLinear()
          .domain([maxVal, -maxVal])
          .range([0, this.height])
          .nice();
      // Data Path
      const lineGenerator = d3.line()
          .x( (d, i) => this.getXScale(i) )
          .y( d => yScale(d) );
      
      return lineGenerator(data);
    },
  },
  //querySelector method uses CSS3 selectors for querying the DOM and CSS3 
  //  doesn't support ID selectors that start with a digit:
  watch: {
    getIndex: function(newIndex) {
      // console.log('watch: ', newIndex, oldIndex);
      this.selected = newIndex;
      // Auto scroll
      // var sectionStart = this.getXScale(this.$store.state.subtitle[newIndex].start);
      // var sectionEnd = this.getXScale(this.$store.state.subtitle[newIndex].end);
      // var wbStart = this.$refs.scroll.scrollLeft;
      // var wbEnd = wbStart + 1024; 
      // // console.log(sectionStart, sectionEnd, wbStart);
      // if ((sectionStart > wbEnd) || (sectionEnd > wbEnd)) {
      //   console.log('scroll right', wbStart - sectionStart + 200);
      //   this.$refs.scroll.scrollLeft += wbStart - sectionStart + 200;
      // }
      // if((sectionStart < wbStart) || (sectionEnd < wbStart)) {
      //   console.log('scroll left', 200 + (wbStart - sectionStart));
      //   this.$refs.scroll.scrollLeft += 200 + (wbStart - sectionStart);
      // }
    }
  },
  methods: {
    getXScale: function(d) {
      const xScale = d3.scaleLinear()
        .domain([this.$store.state.audioStart, this.$store.state.audioEnd])
        .range([0, this.width])
        .nice();
      return xScale(d);
    },
    getXDeScale: function(d) {
      const xScale = d3.scaleLinear()
        .domain([this.$store.state.audioStart, this.$store.state.audioEnd])
        .range([0, this.width])
        .nice();
      return xScale.invert(d);
    },
    getInteract: function() {
      const vm = this;

      // Interact Sections
      interact('.section')
        .on('tap', function (event) {
            const target = event.target;
            const payload = (parseInt(target.getAttribute('id')) || 0);
            // console.log('tab', payload);
            vm.$store.dispatch('setSelection', payload);
        });

      interact('.section.active')
        .resizable({
            edges: { left: true, right: true, bottom: false, top: false },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 10, height: 10 }
                })
            ]
        })
        .on('resizemove', function(event) {
            const target = event.target;
            // console.log(event);

            let index = (parseInt(target.getAttribute('id')) || 0);
            let x = (parseFloat(target.getAttribute('x')) || 0);
            let s = x + event.deltaRect.left;
            let e = event.rect.width + s;
            // console.log(s, e);
            let start = Math.round(vm.getXDeScale(s));
            let end = Math.round(vm.getXDeScale(e));
            // console.log(index, start, end);

            const sectionData = {index: index, start:start, end:end};

            // Should update Data not element !
            // target.setAttribute('width', event.rect.width);
            // target.setAttribute('x', x)
            vm.$store.dispatch('handleSection', sectionData);
        });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wave-box {
    width: 1024px;
    height: 320px;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }
  .line-path {
    fill: none;
    stroke: black;
    stroke-width: 1;
    stroke-linejoin: round;
  }
  .section {
    fill: steelblue;
    opacity: 0.5;
  }
  .section.active {
    fill: orangered;
    opacity: 0.5;
  }
</style>
*/
