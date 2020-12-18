import React, {useCallback, useState} from 'react'
import type {FC, MouseEvent} from 'react'
import * as U from '../utils'
import * as D from '../data'

export default function FileList() {
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
      console.log('_id', _id)
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
        <a href="/" onClick={getFile(file._id)}>
          {file.filename}
        </a>
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
/*
fetch('./tortoise.png')
  // Retrieve its body as ReadableStream
  .then(response => response.body)
  .then(rs => {
    const reader = rs.getReader();

    return new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();

          // When no more data needs to be consumed, break the reading
          if (done) {
            break;
          }

          // Enqueue the next data chunk into our target stream
          controller.enqueue(value);
        }

        // Close the stream
        controller.close();
        reader.releaseLock();
      }
    })
  })
  // Create a new response out of the stream
  .then(rs => new Response(rs))
  // Create an object URL for the response
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob))
  // Update image
  .then(url => image.src = url)
  .catch(console.error);

*/
