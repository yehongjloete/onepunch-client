import * as d3 from 'd3'
import * as U from '../utils'
import type {SVG} from './types'

// https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/

// Set up audio context
const audioContext = new AudioContext()

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

const normalizeData = (filteredData: Float32Array) => {
  const multiplier = Math.pow(Math.max(...filteredData), -1)
  return filteredData.map((n) => n * multiplier)
}

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

export const renderWave2 = async (
  svgRef: SVG,
  rawData: Float32Array,
  sampleRate: number,
  currentTime: number,
  wavUrl: string
) => {
  try {
    console.log('renderWave2')
    //return
    drawAudio(
      //'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3'
      wavUrl
    )
    const maxVal: number = d3.max(rawData, (d: number) => d) ?? 0
    //console.log('renderWave', rawData.length, 'maxVal', maxVal)

    //console.log('renderWave', svgRef, rawData)
  } catch (e) {
    console.log('renderWave.err:', e.message)
  }
}
