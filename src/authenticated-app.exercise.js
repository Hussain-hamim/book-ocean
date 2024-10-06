/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Routes, Route, Link as RouterLink, useMatch} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'
import {Button, ErrorMessage, FullPageErrorFallback} from './components/lib'
import * as mq from './styles/media-queries'
import * as colors from './styles/colors'
import {useAuth} from './context/auth-context'
import {ReadingListScreen} from './screens/reading-list'
import {FinishedScreen} from './screens/finished'
import {DiscoverBooksScreen} from './screens/discover'
import {BookScreen} from './screens/book'
import {NotFoundScreen} from './screens/not-found'
import React from 'react'
import {FaMoon, FaSun, FaUnderline} from 'react-icons/fa'
import {DarkModeContext} from 'index.exercise'
// import {DarkModeContext} from 'index.exercise'

function ErrorFallback({error}) {
  return (
    <ErrorMessage
      error={error}
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}

function AuthenticatedApp() {
  const {user, logout} = useAuth()
  const [darkMode, setDarkMode] = React.useContext(DarkModeContext)

  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <div
        css={{
          color: darkMode.darkMode ? 'white' : 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '10px',
          [mq.small]: {
            justifyContent: 'start',
            marginLeft: '15px',
          },
        }}
      >
        <h3>
          <u
            css={{
              ':hover': {
                // color: colors.indigo,
                textDecoration: 'none',
              },
            }}
          >
            Book Ocean
          </u>
        </h3>
      </div>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      >
        <button
          onClick={mode => setDarkMode({darkMode: !darkMode.darkMode})}
          css={{
            marginRight: '10px',
            marginLeft: '10px',
            border: 'none',
            borderRadius: '5px',
            paddingBottom: '5px',
            backgroundColor: darkMode.darkMode ? 'gray' : null,
          }}
          title="change color mode"
        >
          {darkMode.darkMode ? <FaMoon /> : <FaSun />}
        </button>
        <span
          css={{
            color: darkMode.darkMode ? 'white' : colors.text,
          }}
        >
          {user.username}
        </span>
        <Button
          variant="secondary"
          css={{
            marginLeft: '10px',
            backgroundColor: darkMode.darkMode ? 'gray' : null,
            color: darkMode.darkMode ? 'white' : null,
          }}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
      <div
        css={{
          backgroundColor: darkMode.darkMode ? '#212529' : 'white',
          margin: '0 auto',

          padding: '4em 0em',
          maxWidth: '840px',

          width: '100%',
          display: 'grid',
          gridGap: '1em',
          gridTemplateColumns: '1fr 3fr',
          [mq.small]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
            width: '100%',

            paddingTop: '30px',
            paddingLeft: '20px',
            maxWidth: '100%',
          },
        }}
      >
        <div
          css={{
            position: 'relative',
            [mq.small]: {
              paddingRight: '10px',
            },
          }}
        >
          <Nav />
        </div>
        <main
          css={{
            width: '100%',
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}

function NavLink(props) {
  const match = useMatch(props.to)
  const [darkMode] = React.useContext(DarkModeContext)

  return (
    <RouterLink
      css={[
        {
          // color: colors.text,
          color: darkMode.darkMode ? 'white' : colors.text,

          display: 'block',
          padding: '8px 15px 8px 10px',
          margin: '5px 0',
          width: '100%',
          height: '100%',
          borderRadius: '2px',
          borderLeft: '5px solid transparent',
          ':hover': {
            color: colors.indigo,
            // color: darkMode.darkMode ? 'white' : null,

            textDecoration: 'none',
            background: colors.gray10,
          },
        },
        match
          ? {
              color: darkMode.darkMode ? 'black' : null,
              borderLeft: `5px solid ${colors.indigo}`,
              background: colors.gray10,
              ':hover': {
                background: colors.gray10,
              },
            }
          : null,
      ]}
      {...props}
    />
  )
}

function Nav(params) {
  return (
    <nav
      css={{
        position: 'sticky',
        top: '4px',
        padding: '1em 1.5em',
        border: `1px solid ${colors.gray10}`,
        borderRadius: '3px',
        [mq.small]: {
          position: 'static',
          top: 'auto',
        },
      }}
    >
      <ul
        css={{
          listStyle: 'none',
          padding: '0',
        }}
      >
        <li>
          <NavLink to="/list">Reading List</NavLink>
        </li>
        <li>
          <NavLink to="/finished">Finished Books</NavLink>
        </li>
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/list" element={<ReadingListScreen />} />
      <Route path="/finished" element={<FinishedScreen />} />
      <Route path="/discover" element={<DiscoverBooksScreen />} />
      <Route path="/book/:bookId" element={<BookScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

// 🐨 change this to a default export
export default AuthenticatedApp

// 🐨 Unfortunately, to make this work for our workshop,
// you need to add this to src/authenticated-app.js:
// export {default} from './authenticated-app.exercise'
