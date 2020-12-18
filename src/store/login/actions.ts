import {Action, Dispatch} from 'redux'
import * as T from './types'
import * as U from '../../utils'
import * as E from '../error'

export const setLoginAction = (
  payload: Omit<T.State, 'jwt'>
): T.SetLoginAction => ({
  type: '@login/SetLoginAction',
  payload
})
export const setJwtAction = (
  payload: Pick<T.State, 'jwt'>
): T.SetAJwtAction => ({
  type: '@login/SetJwtAction',
  payload
})
export const setLogoutAction = () => ({type: '@login/SetLogoutAction'})

export const login = ({
  password,
  email
}: Pick<T.State, 'email' | 'password'>) => (dispatch: Dispatch) => {
  console.log('login', password, email)
  fetch(U.getUrl('/login'), {
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((result) => {
      const {jwt, ...remains} = result
      //console.log('remains', remains)
      dispatch(setLoginAction(remains))
      dispatch(setJwtAction({jwt}))
    })
    .catch((e: Error) => E.setErrorAction({message: e.message}))
}

export const signUp = ({name, password, email}: Omit<T.State, 'jwt'>) => (
  dispatch: Dispatch
) => {
  fetch(U.getUrl('/signUp'), {
    method: 'POST',
    body: JSON.stringify({name, email, password}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((result) => {
      const {jwt, ...remains} = result
      //console.log('remains', remains)
      dispatch(setLoginAction(remains))
      dispatch(setJwtAction({jwt}))
    })
    .catch((e: Error) => E.setErrorAction({message: e.message}))
}
