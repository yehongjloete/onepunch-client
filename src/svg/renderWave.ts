import * as d3 from 'd3'
import * as U from '../utils'
import type {SVG} from './types'
// https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/

// Set up audio context
const audioContext = new AudioContext()

/**
 * Retrieves audio from an external source, the initializes the drawing function
 * @param {String} url the url of the audio we'd like to fetch
 */
const drawAudio = (url: string) => {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    //.then((audioBuffer) => draw(normalizeData(filterData(audioBuffer))))
    .then((audioBuffer) => {
      const d1 = filterData(audioBuffer)
      //const d1 = audioBuffer.getChannelData(0)
      const d2 = normalizeData(d1)
      draw(d2)
    })
}

/**
 * Filters the AudioBuffer retrieved from an external source
 * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
 * @returns {Array} an array of floating point numbers
 */
const filterData = (audioBuffer: AudioBuffer): Float32Array => {
  const rawData = audioBuffer.getChannelData(0) // We only need to work with one channel of data
  const samples = 8000 // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples) // the number of samples in each subdivision
  const filteredData = []
  for (let i = 0; i < samples; i++) {
    const blockStart = blockSize * i // the location of the first sample in the block
    let sum = 0
    // require  "downlevelIteration": true, in tsconfig.json
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
  }
  return Float32Array.from(filteredData)
}

/**
 * Normalizes the audio data to make a cleaner illustration
 * @param {Array} filteredData the data from filterData()
 * @returns {Array} an normalized array of floating point numbers
 */
const normalizeData = (filteredData: Float32Array) => {
  const multiplier = Math.pow(Math.max(...filteredData), -1)
  return filteredData.map((n) => n * multiplier)
}

/**
 * Draws the audio file into a canvas element.
 * @param {Array} normalizedData The filtered array returned from filterData()
 * @returns {Array} a normalized array of data
 */
const draw = (normalizedData: Float32Array) => {
  // set up the canvas
  const canvas = document.querySelector('canvas')
  const dpr = window.devicePixelRatio || 1
  const padding = 20
  if (canvas) {
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.translate(0, canvas.offsetHeight / 2 + padding) // set Y = 0 to be in the middle of the canvas

      // draw the line segments
      const width = canvas.offsetWidth / normalizedData.length
      for (let i = 0; i < normalizedData.length; i++) {
        const x = width * i
        let height = normalizedData[i] * canvas.offsetHeight - padding
        if (height < 0) {
          height = 0
        } else if (height > canvas.offsetHeight / 2) {
          //height = height > canvas.offsetHeight / 2
          height = canvas.offsetHeight / 2
        }
        //drawLineSegment(ctx, x, height, width, (i + 1) % 2)
        drawLineSegment(ctx, x, height, width, (i + 1) % 2 ? true : false)
      }
    }
  }
}

/**
 * A utility function for drawing our line segments
 * @param {AudioContext} ctx the audio context
 * @param {number} x  the x coordinate of the beginning of the line segment
 * @param {number} height the desired height of the line segment
 * @param {number} width the desired width of the line segment
 * @param {boolean} isEven whether or not the segmented is even-numbered
 */
const drawLineSegment = (
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number,
  width: number,
  isEven: boolean
) => {
  ctx.lineWidth = 1 // how thick the line is
  //ctx.strokeStyle = '#fff' // what color our line is
  ctx.strokeStyle = 'black'
  ctx.beginPath()
  height = isEven ? height : -height
  ctx.moveTo(x, 0)
  ctx.lineTo(x, height)
  ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven)
  ctx.lineTo(x + width, 0)
  ctx.stroke()
}

export const renderWave = async (
  svgRef: SVG,
  rawData: Float32Array,
  sampleRate: number,
  currentTime: number,
  wavUrl: string
) => {
  try {
    //return
    drawAudio(
      //'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3'
      wavUrl
    )
    const maxVal: number = d3.max(rawData, (d: number) => d) ?? 0
    console.log('renderWave', rawData.length, 'maxVal', maxVal)

    //console.log('renderWave', svgRef, rawData)
  } catch (e) {
    console.log('renderWave.err:', e.message)
  }
}
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
*/
