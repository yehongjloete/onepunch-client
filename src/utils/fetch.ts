export const host = 'localhost'
export const port = 4000
export const getUrl = (path: string) => `http://${host}:${port}${path}`
export const uploadUrl = getUrl('/upload')

export const uloadFiles = <T>(data: T) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: (data as unknown) as ReadableStream<Uint8Array>
      })
      resolve(response)
    } catch (e) {
      reject(e)
    }
  })
