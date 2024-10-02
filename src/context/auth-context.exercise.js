// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext

import * as React from 'react'

const AuthContext = React.createContext()

const useAuth = () => React.useContext(AuthContext)

export {AuthContext, useAuth}
