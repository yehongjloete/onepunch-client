import * as T from './types'

const initialState: T.State = {
  message: ''
}

export const reducer = (
  state: T.State = initialState,
  action: T.Actions
): T.State => {
  switch (action.type) {
    case '@error:SetErrorAction':
      return {...state, ...action.payload}
  }
  return state
}
