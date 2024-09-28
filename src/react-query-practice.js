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
