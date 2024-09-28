const {
  useMutation,
  useQuery,
} = require('react-query/dist/react-query.development')

function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
  })
}

function ChangeName({id}) {
  const {mutate} = useUpdateUser()

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        const newName = new FormData(event.currentTarget).get('name')
        mutate({id, newName})
      }}
    >
      <input name="name" />
      <button type="submit">Update</button>
    </form>
  )
}

////////////////

function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
  })
}

function ChangeName({id}) {
  const {mutate, status} = useUpdateUser()

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        const newName = new FormData(event.currentTarget).get('name')
        mutate({id, newName})
      }}
    >
      <input name="name" />
      <button type="submit" disabled={status === 'pending'}>
        {status === 'pending' ? '...' : 'Update'}
      </button>
    </form>
  )
}

////

function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
    onSuccess: newUser => alert(`user updated to ${newUser.name} `),
  })
}

const queryClient = useQueryClient()

/**  It's important to note that React Query doesn't
 * distinguish where data comes from. Data we write
 * to the cache manually will be treated the same as
 *  data put into the cache via any other way – like a
 * refetch or prefetch. */
function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
    onSuccess: newUser =>
      queryClient.setQueryData(['user', newUser.id], newUser),
  })
}

function ChangeName({id}) {
  const {mutate, status} = useUpdateUser()

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        const newName = new FormData(event.currentTarget).get('name')
        mutate(
          {id, newName},
          // this is second argument to mutate fn return by useMutation
          {
            onSuccess: () => event.currentTarget.reset(),
          },
        )
      }}
    >
      <input name="name" />
      <button type="submit" disabled={status === 'pending'}>
        {status === 'pending' ? '...' : 'Update'}
      </button>
    </form>
  )
}
