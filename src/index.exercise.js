import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Logo} from './components/logo'

import ReactDOM from 'react-dom'

function App() {
  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Books Ocean</h1>
      <div>
        <button onClick={() => alert('login clicked')}>Login</button>
      </div>
      <div>
        <button onClick={() => alert('register clicked')}>Register</button>
      </div>
    </div>
  )
}

// const root = createRoot(document.getElementById('root'))
// root.render(<App />)
// export {root}

ReactDOM.render(<App />, document.getElementById('root'))
