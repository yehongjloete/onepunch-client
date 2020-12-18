import {useState, useCallback} from 'react'
import type {MutableRefObject} from 'react'

export const useOnTimeUpdate = (
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  videoRef: MutableRefObject<HTMLVideoElement | null>
) => {
  const [currentTime, setCurrentTime] = useState<number>(0)
  const onTimeUpdate = /*useCallback(*/ () => {
    //console.log('onTimeUpdate', audioRef.current?.currentTime)
    //console.log('onTimeUpdate', videoRef.current?.currentTime)
    //setCurrentTime((notUsed) => audioRef.current?.currentTime ?? 0)
    setCurrentTime((notUsed) => videoRef.current?.currentTime ?? 0)
  } /*, [videoRef.current?.currentTime])*/
  return {onTimeUpdate, currentTime}
}
