import {useCallback} from 'react'
import {useSelector} from 'react-redux'
import type {AppState} from '../store'
import * as Login from '../store/login'

export const useJwtFetch = (url: string, data: any): Promise<Response> => {
  const {jwt} = useSelector<AppState, Login.State>(({login}) => login)
  return fetch(url, {
    ...data,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
}
