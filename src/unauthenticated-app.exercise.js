/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {Input, Button, Spinner, FormGroup, ErrorMessage} from './components/lib'
import {Modal, ModalContents, ModalOpenButton} from './components/modal'
import {Logo} from './components/logo'
import {useAuth} from './context/auth-context'
import {useAsync} from './utils/hooks'
import {DarkModeContext} from 'index.exercise'
import {FaMoon, FaSun, FaCopyright} from 'react-icons/fa'

function LoginForm({onSubmit, submitButton}) {
  const {isLoading, isError, error, run} = useAsync()
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements

    run(
      onSubmit({
        username: username.value,
        password: password.value,
      }),
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px',
        },
      }}
    >
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>
        {React.cloneElement(
          submitButton,
          {type: 'submit'},
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
          isLoading ? <Spinner css={{marginLeft: 5}} /> : null,
        )}
      </div>
      {isError ? <ErrorMessage error={error} /> : null}
    </form>
  )
}

function UnauthenticatedApp() {
  const {login, register} = useAuth()
  const [darkMode, setDarkMode] = React.useContext(DarkModeContext)

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Logo width="80" height="80" />
      <h1
        css={{
          color: darkMode.darkMode ? 'white' : 'black',
        }}
      >
        Book Ocean
      </h1>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridGap: '0.75rem',
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm
              onSubmit={login}
              submitButton={<Button variant="primary">Login</Button>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
        <button
          onClick={mode => setDarkMode({darkMode: !darkMode.darkMode})}
          css={{
            // marginRight: '10px',
            // marginLeft: '10px',
            border: 'none',
            borderRadius: '10px',
            paddingBottom: '5px',
            // width: '50px',
            backgroundColor: 'gray',
            position: 'absolute',
            top: '20px',
            right: '30px',
            width: '50px',
          }}
          title="change color mode"
        >
          {darkMode.darkMode ? <FaMoon /> : <FaSun />}
        </button>
        <div
          css={{
            // paddingRight: '5px',
            color: darkMode.darkMode ? 'white' : 'black',
            position: 'absolute',
            right: '20px',
            bottom: '20px',
          }}
        >
          <FaCopyright
            css={{
              paddingRight: '5px',
            }}
          />
          Hussain-hamim 2024
        </div>
      </div>
    </div>
  )
}

// 🐨 change this to a default export
export default UnauthenticatedApp

// 🐨 Unfortunately, to make this work for our workshop,
// you need to add this to src/unauthenticated-app.js:
// export {default} from './unauthenticated-app.exercise'
