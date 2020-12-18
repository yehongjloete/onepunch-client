import * as T from './types'

const initialState: T.State = {
  jwt: '',
  name: '',
  password: '',
  email: ''
}

export const reducer = (
  state: T.State = initialState,
  action: T.Actions
): T.State => {
  console.log('action', action)
  switch (action.type) {
    case '@login/SetJwtAction':
      return {...state, jwt: action.payload.jwt}
    case '@login/SetLoginAction':
      return {...state, ...action.payload}
    case '@login/SetLogoutAction':
      return initialState
  }
  return state
}
