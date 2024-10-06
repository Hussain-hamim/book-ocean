/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from 'components/lib'
import {DarkModeContext} from 'index.exercise'
import React from 'react'

function NotFoundScreen() {
  const [darkMode] = React.useContext(DarkModeContext)
  return (
    <div
      css={{
        height: '100vh',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        css={{
          padding: '5px',
          color: darkMode.darkMode ? 'white' : 'black',
          backgroundColor: darkMode.darkMode ? '' : '#f1f2f7',
        }}
      >
        Sorry... nothing here. <Link to="/list">Go home</Link>
      </div>
    </div>
  )
}

export {NotFoundScreen}
