import * as T from './types'

export const setErrorAction = (payload: T.State) => ({
  type: '@error/SetErrorAction',
  payload
})
