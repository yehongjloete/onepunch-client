import React, {useEffect, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import * as U from '../utils'
import type {AppState} from '../store'
import * as Login from '../store/login'
import * as Error from '../store/error'
import {useJwtFetch} from '../hooks'

export default function AuthHome() {
  const dispatch = useDispatch()
  const {name, email, jwt, password} = useSelector<AppState, Login.State>(
    ({login}) => login
  )
  //const fetch = useJwtFetch()
  const error = useSelector<AppState, Error.State>(({error}) => error)
  const signUp = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const body = {
      name: 'test',
      password: '1234',
      email: 'abc@gef.com'
    }
    dispatch(Login.signUp(body))
  }, [])
  const login = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const body = {
      password: '1234',
      email: 'abc@gef.com'
    }
    dispatch(Login.login(body))
  }, [])
  const logout = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(Login.setLogoutAction())
  }, [])
  const profile = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      fetch(U.getUrl('/profile'), {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
        .then((result) => console.log('/profile', result))
        .catch((e: Error) => console.log('err', e.message))
    },
    [jwt]
  )

  //useEffect(signUp, [])
  return (
    <div>
      <h1>AuthHome</h1>
      <div>
        <a href="" style={{marginRight: 10}} onClick={signUp}>
          sign up
        </a>
        <a href="" style={{marginRight: 10}} onClick={login}>
          login
        </a>
        <a href="" style={{marginRight: 10}} onClick={profile}>
          profile
        </a>
        <a href="" style={{marginRight: 10}} onClick={logout}>
          logout
        </a>
      </div>
      <div style={{display: 'flext', flexDirection: 'row'}}>
        <h2>name: {name}</h2>
        <h2>email: {email}</h2>
        <h2>password: {password}</h2>
        <h2>jwt: {jwt}</h2>
        {error.message.length && <h2>error: {error.message}</h2>}
      </div>
    </div>
  )
}
