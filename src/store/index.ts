import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {logger} from './logger'
import * as L from './login'
import * as E from './error'

export type AppState = {
  login: L.State
  error: E.State
}

const rootReducer = combineReducers<AppState>({
  login: L.reducer,
  error: E.reducer
})

export const makeStore = () => {
  const middlewares: any[] = [thunk]

  //middlewares.push(logger)

  return createStore(rootReducer, applyMiddleware(...middlewares))
}
