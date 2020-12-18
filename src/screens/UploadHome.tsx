import React, {useState, useCallback} from 'react'
import type {MouseEvent, ChangeEvent} from 'react'
import * as U from '../utils'

export default function UploadHome() {
  const [fileList, setFileList] = useState<FileList | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const selectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList((notUsed) => e.target.files)
    //console.log('files', e.target.files)
  }
  const submit = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('submit', fileList)
    if (fileList) {
      const formData = new FormData()
      Array.from(fileList).map((file, index) => {
        formData.append(`file${index}`, file)
      })
      U.uloadFiles(formData)
        .then((res) => {
          console.log('res', res)
        })
        .catch(setError)
    }
  }
  return (
    <div>
      <h1>Upload Home</h1>
      {error && <h2>{error.message}</h2>}
      <form method="POST" encType="multipart/form-data">
        <div>
          <label>Select multiple images:</label>
          <input
            type="file"
            name="multiple_images"
            multiple
            onChange={selectFiles}
          />
        </div>
        <div>
          <input type="submit" onClick={submit} value="Upload" />
        </div>
      </form>
    </div>
  )
}
