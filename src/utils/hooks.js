import * as React from 'react'

// this hook preventing state update on unmounted components
function useSafeDispatch(dispatch) {
  // Create a ref to track if the component is mounted
  const mounted = React.useRef(false)

  // Use useLayoutEffect to set the mounted ref to true when the component mounts
  // and set it to false when the component unmounts
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])

  // Return a memoized callback that only dispatches if the component is mounted
  return React.useCallback(
    // If the component is not mounted, it does nothing (void 0)
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch], // The callback depends on the dispatch function
  )
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])

const defaultInitialState = {status: 'idle', data: null, error: null}
/////////////////

function useAsync(initialState) {
  // Create a ref to store the initial state, combining default and provided initial state
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })

  // Use useReducer to manage the state of the async operation
  // The reducer merges the current state with the action payload
  const [{status, data, error}, setState] = React.useReducer(
    (s, a) => ({...s, ...a}),
    initialStateRef.current,
  )

  // Wrap setState with useSafeDispatch to ensure it is only called if the component is mounted
  const safeSetState = useSafeDispatch(setState)

  // Memoized callback to set data and update status to 'resolved'
  const setData = React.useCallback(
    data => safeSetState({data, status: 'resolved'}),
    [safeSetState], // The callback depends on safeSetState
  )

  // Memoized callback to set error and update status to 'rejected'
  const setError = React.useCallback(
    error => safeSetState({error, status: 'rejected'}),
    [safeSetState], // The callback depends on safeSetState
  )

  // Wrap dispatch with useSafeDispatch to ensure it is only called if the component is mounted
  const safeDispatch = useSafeDispatch(safeSetState)

  // Memoized callback that only dispatches if the component is mounted
  const safeCallback = React.useCallback(
    (...args) => (initialStateRef.current ? safeDispatch(...args) : void 0),
    [safeDispatch], // The callback depends on dispatch
  )

  // Memoized callback to reset the state to the initial state
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState], // The callback depends on safeSetState
  )

  // Memoized callback to run an async operation
  const run = React.useCallback(
    promise => {
      // Ensure the argument is a promise
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      // Set the status to 'pending'
      safeSetState({status: 'pending'})
      // Handle the promise resolution and rejection
      return promise.then(
        data => {
          setData(data) // Set data and update status to 'resolved'
          return data
        },
        error => {
          setError(error) // Set error and update status to 'rejected'
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError], // The callback depends on safeSetState, setData, and setError
  )

  // Return the state and functions for managing the async operation
  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export {useAsync}
