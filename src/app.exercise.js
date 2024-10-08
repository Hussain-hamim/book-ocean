import * as React from 'react'
import {useAuth} from './context/auth-context'
// 🐨 you'll want to render the FullPageSpinner as the fallback
import {FullPageSpinner} from './components/lib'

// 🐨 exchange these for React.lazy calls
// const AuthenticatedApp = React.lazy(() => import('./authenticated-app'))
const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './authenticated-app'),
)
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))
// const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  // const [darkMode, setDarkMode] = React.useState({darkMode: false})
  const {user} = useAuth()

  // console.log(darkMode)
  // <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
  // </DarkModeContext.Provider>

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}
