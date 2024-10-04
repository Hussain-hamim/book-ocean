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

/////////////////////

import * as React from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {fetchTodos, addTodo} from './api'

function useAddTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['todos', 'list'],
      })
    },
  })
}

function useTodos(sort) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['todos', 'list', {sort}],
    queryFn: () => fetchTodos(sort),
    placeholderData: () => queryClient.getQueryData(['todos', 'list', {sort}]),
    staleTime: 10 * 1000,
  })
}

export default function TodoList() {
  const [sort, setSort] = React.useState('id')
  const {status, data, isPlaceholderData} = useTodos(sort)
  const addTodo = useAddTodo()

  const handleAddTodo = event => {
    event.preventDefault()
    const title = new FormData(event.currentTarget).get('add')
    addTodo.mutate(title, {
      onSuccess: () => event.target.reset(),
    })
  }

  if (status === 'pending') {
    return <div>...</div>
  }

  if (status === 'error') {
    return <div>Error fetching todos</div>
  }

  return (
    <div style={{opacity: isPlaceholderData ? 0.8 : 1}}>
      <label>
        Sort by:
        <select
          value={sort}
          onChange={event => {
            setSort(event.target.value)
          }}
        >
          <option value="id">id</option>
          <option value="title">title</option>
          <option value="done">completed</option>
        </select>
      </label>
      <ul>
        {data.map(todo => (
          <li key={todo.id}>
            {todo.done ? '✅ ' : '🗒 '}
            {todo.title}
          </li>
        ))}
      </ul>
      <form
        onSubmit={handleAddTodo}
        style={{opacity: addTodo.isPending ? 0.8 : 1}}
      >
        <label>
          Add:
          <input type="text" name="add" placeholder="new todo" />
        </label>
        <button type="submit" disabled={addTodo.isPending}>
          Submit
        </button>
      </form>
    </div>
  )
}
