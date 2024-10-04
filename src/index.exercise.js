import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Profiler} from 'components/profiler'
import {App} from './app'
import {AppProviders} from './context'

// ignore the rootRef in this file. I'm just doing it here to make
// the tests I write to check your work easier.

const DarkModeContext = React.createContext()

function Mode() {
  const [darkMode, setDarkMode] = React.useState({darkMode: false})
  return (
    <div
      style={{
        backgroundColor: darkMode.darkMode ? '#212529' : 'white',
      }}
    >
      <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
        <App />
      </DarkModeContext.Provider>
    </div>
  )
}

export const rootRef = {}
loadDevTools(() => {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <Mode />
      </AppProviders>
    </Profiler>,
  )
  rootRef.current = root
})

export {DarkModeContext}
