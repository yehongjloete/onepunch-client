import React, {useMemo} from 'react'
import type {FC} from 'react'
import {Provider as ReduxProvider} from 'react-redux'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import './App.css'
// Styles
import 'video.js/dist/video-js.css'

import {makeStore} from './store'
import Home from './screens/Home'
import UploadHome from './screens/UploadHome'
import AuthHome from './screens/AuthHome'
import FileList from './screens/FileList'
import Video from './screens/Video'
import Audio from './screens/Audio'
import Decode from './screens/Decode'

const store = makeStore()

type LinkInfo = {
  to: string
  exact: boolean
  title: string
  Component: FC<any>
}

export default function App() {
  const links = useMemo<LinkInfo[]>(
    () => [
      {to: '/', exact: true, title: 'Home', Component: Home},
      {
        to: '/upload',
        exact: false,
        title: 'Upload',
        Component: UploadHome
      },
      {to: '/auth', exact: false, title: 'Auth', Component: AuthHome},
      {to: '/list', exact: false, title: 'fileList', Component: FileList},
      {to: '/video', exact: false, title: 'Video', Component: Video},
      {to: '/audio/:id', exact: false, title: 'Audio', Component: Audio},
      {to: '/decode', exact: false, title: 'Decode', Component: Decode}
    ],
    []
  )
  const linkChildren = useMemo(
    () =>
      links.map(({to, title}) => {
        return (
          <li key={to} style={{marginRight: 10}}>
            <Link to={to}>{title}</Link>
          </li>
        )
      }),
    []
  )
  const switchChildren = links.map(({to, exact, Component}) => {
    return (
      <Route path={to} exact={exact} key={to}>
        <Component />
      </Route>
    )
  })
  return (
    <ReduxProvider store={store}>
      <Router>
        <div>
          <nav>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'row',
                listStyle: 'none'
              }}>
              {linkChildren}
            </ul>
          </nav>
          <Switch>{switchChildren}</Switch>
        </div>
      </Router>
    </ReduxProvider>
  )
}
