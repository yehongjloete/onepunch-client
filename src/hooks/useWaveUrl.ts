import {useState, useEffect, useRef, MutableRefObject} from 'react'
import type {SVG} from '../svg'

const subsampling = (data: Float32Array, sampleRate: number) => {
  const rate = sampleRate / 1000
  const length = data.length / rate

  //console.log(length)
  const d3Data = new Float32Array(length)

  let count = -1
  for (let i = 0; i < data.length; i++) {
    const sampling = Math.floor(i / rate)
    if (sampling != count) {
      count = sampling
      d3Data[count] = data[i]
    }
  }

  // console.log(count);
  return d3Data
}

export const useWaveUrl = (
  wavUrl: string,
  svgRef: MutableRefObject<SVGSVGElement | null>,
  currentTime: number,
  renderWave: (
    svgRef: SVG,
    rawData: Float32Array,
    sampleRate: number,
    currentTime: number,
    wavUrl: string
  ) => void
) => {
  const audioCtx = useRef(new AudioContext()).current
  const [decodedData, setDecodedData] = useState<any>()
  const [source, setSource] = useState<AudioBufferSourceNode>()

  const [length, setLength] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [sampleRate, setSampleRate] = useState<number>(0)
  const [numberOfChannels, setNumberOfChannels] = useState<number>(0)
  const [rawData, setRawData] = useState<Float32Array>(Float32Array.from([]))

  useEffect(() => {
    // this code used for d3 drawing only
    setLength(0)
    setDuration(0)
    setSampleRate(0)
    setNumberOfChannels(0)
    setRawData(Float32Array.from([]))

    fetch(wavUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioCtx.decodeAudioData(buffer))
      .then((decodedData: AudioBuffer) => {
        //console.log('decodedData', decodedData)
        setDecodedData(decodedData)

        const {length, duration, sampleRate, numberOfChannels} = decodedData

        setLength(length)
        setDuration(duration)
        setSampleRate(sampleRate)
        setNumberOfChannels(numberOfChannels)

        const rawData: Float32Array = subsampling(
          decodedData.getChannelData(0),
          sampleRate
        )
        setRawData(rawData)

        renderWave(svgRef, rawData, sampleRate, currentTime, wavUrl)
        //const source = audioCtx.createBufferSource()
        //setSource((notUsed) => source)
        //audioCtx.resume()
        //source.buffer = decodedData
        //source.connect(audioCtx.destination)
      })
  }, [wavUrl])

  useEffect(() => {
    // renderWave(svgRef, rawData, sampleRate, currentTime)
  }, [svgRef, rawData.length, sampleRate, currentTime])
  return {
    audioCtx,
    source,
    length,
    duration,
    sampleRate,
    numberOfChannels,
    rawData
  }
}
