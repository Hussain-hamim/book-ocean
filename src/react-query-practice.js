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
