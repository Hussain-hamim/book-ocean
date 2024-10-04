import * as React from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {fetchTodos, addTodo, toggleTodo} from './api'

function useToggleTodo(id, sort) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleTodo(id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['todos', 'list', {sort}],
      })

      const snapshot = queryClient.getQueryData(['todos', 'list', {sort}])

      queryClient.setQueryData(['todos', 'list', {sort}], previousTodos =>
        previousTodos?.map(todo =>
          todo.id === id ? {...todo, done: !todo.done} : todo,
        ),
      )

      return () => {
        queryClient.setQueryData(['todos', 'list', {sort}], snapshot)
      }
    },
    onError: (error, variables, rollback) => {
      console.log('error', error)
      rollback?.()
    },
    onSettled: () => {
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
    placeholderData: queryClient.getQueryData(['todos', 'list', {sort}]),
    staleTime: 10 * 1000,
  })
}

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

function Todo({todo, sort}) {
  const {mutate, isPending} = useToggleTodo(todo.id, sort)

  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={mutate} />
      {todo.title}
    </li>
  )
}

export function TodoList() {
  const [sort, setSort] = React.useState('id')
  const {status, data, isPlaceholderData} = useTodos(sort)
  const addTodo = useAddTodo()

  if (status === 'pending') {
    return <div>...</div>
  }

  if (status === 'error') {
    return <div>Error fetching todos</div>
  }

  const handleAddTodo = event => {
    event.preventDefault()
    const title = new FormData(event.currentTarget).get('add')
    addTodo.mutate(title, {
      onSuccess: () => event.target.reset(),
    })
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
          <Todo todo={todo} key={todo.id} sort={sort} />
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
