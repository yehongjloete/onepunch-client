import type {Action} from 'redux'

export type State = {
  message: string
}

export type SetErrorAction = {
  type: '@error:SetErrorAction'
  payload: State
}

export type Actions = SetErrorAction
