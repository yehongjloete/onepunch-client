import type {Action} from 'redux'

export type State = {
  jwt: string
  name: string
  password: string
  email: string
}

export type SetLoginAction = {
  type: '@login/SetLoginAction'
  payload: Omit<State, 'jwt'>
}
export type SetAJwtAction = {
  type: '@login/SetJwtAction'
  payload: Pick<State, 'jwt'>
}
export type SetLogoutAction = {
  type: '@login/SetLogoutAction'
}
export type Actions = SetLoginAction | SetAJwtAction | SetLogoutAction
