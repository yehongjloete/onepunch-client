import React, {useState, useCallback, useEffect} from 'react'
import type {FC, MouseEvent} from 'react'
import * as U from '../utils'
import * as D from '../data'

import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import {useRouteMatch} from 'react-router-dom'
import type {match} from 'react-router-dom'

const FileList = () => {
  const [files, setFiles] = useState<D.IFile[]>([])
  const [error, setError] = useState<Error | null>(null)
  const getFiles = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    fetch(U.getUrl('/list'))
      .then((res) => res.json())
      .then(({files}) => setFiles((notUsed) => files))
      .catch(setError)
  }, [])
  const getFile = useCallback(
    (_id: string) => (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      fetch(U.getUrl(`/getFile/${_id}`))
        .then((res) => res.body)
        .then((rs) => {
          console.log('rs', rs)
          if (rs) {
            const reader = rs.getReader()
          }
        })
        .catch(setError)
    },
    []
  )

  const children = files.map((file) => {
    return (
      <li key={file._id}>
        <a href={`/audio/${file._id}`}>{file.filename}</a>
      </li>
    )
  })
  return (
    <div>
      <h1>FileList</h1>
      <a href="" onClick={getFiles}>
        get files
      </a>
      {error && <h2>error: {error.message}</h2>}
      <ul>{children}</ul>
    </div>
  )
}

export default function Audio() {
  const [src, setSrc] = useState<string | null>(null)
  const match = useRouteMatch<{id: string}>({
    path: '/audio/:id',
    strict: true,
    sensitive: true
  })
  useEffect(() => {
    setSrc((notUsed) => null)
    console.log('match', match?.params)
    if (match?.params) {
      const id = match.params.id
      if (id) {
        const path = U.getUrl('/getFile')
        setSrc((notUsed) => `${path}/${id}`)
      }
    }
  }, [match])

  return (
    <div>
      <h1>Audio</h1>
      <FileList />
      {src && (
        <AudioPlayer
          autoPlay
          src={src}
          onPlay={(e) => console.log('onPlay')}
          // other props here
        />
      )}
    </div>
  )
}
