import {useRef, useEffect, useState, useMemo} from 'react'

export type WebSocketEventCallbacks = {
  onOpen?: () => void
  onMessage?: (d: any) => void
  onClose?: (e: CloseEvent) => void
}

export const useWebSocket = (
  callbacks: WebSocketEventCallbacks,
  baseUrl: string
): [(data: any) => void, ErrorEvent | null, () => void] => {
  const ws = useRef<WebSocket>(new WebSocket(baseUrl)).current
  const [error, setError] = useState<ErrorEvent | null>(null)
  const eventCallbacks = useMemo(() => callbacks, [])

  const send = (message: any) => {
    ws.send(JSON.stringify(message))
  }
  const close = () => ws.close()

  useEffect(() => {
    ws.onopen = () => {
      eventCallbacks.onOpen && eventCallbacks.onOpen()
    }
    ws.onmessage = (e: MessageEvent) => {
      try {
        eventCallbacks.onMessage && eventCallbacks.onMessage(JSON.parse(e.data))
      } catch (e) {
        setError(e)
      }
    }
    ws.onerror = (e: Event) => {
      console.log('ws.onerror', e)
    }
    ws.onclose = (e: CloseEvent) => {
      eventCallbacks.onClose && eventCallbacks.onClose(e)
    }
  }, [])

  return [send, error, close]
}