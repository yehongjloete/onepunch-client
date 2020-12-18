import React, {useState, useEffect} from 'react'
import type {FC} from 'react'
import D3Page from './D3Page'
import {useWebSocket} from '../hooks'

export type HomeProps = {
  p?: any
}

const Home: FC<HomeProps> = () => {
  const [send, wserror, close] = useWebSocket(
    {
      onOpen() {
        console.log('ws.onOpen')
        send({message: 'How are you?'})
      },
      onMessage(data: any) {
        console.log('onMessage', data)
      },
      onClose() {
        console.log('ws.onClose')
      }
    },
    'ws://localhost:4000'
  )
  return (
    <div className="container-fluid">
      <div className="alert alert-primary" role="alert">
        A simple primary alert—check it out!
      </div>
      <D3Page />
    </div>
  )
}
export default Home
