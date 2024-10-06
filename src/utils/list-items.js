import {useQuery, useMutation, queryCache} from 'react-query'
import {setQueryDataForBook} from './books'
import {useClient} from 'context/auth-context'

// this below module should be explain
// and well learn and document by copilot:

// this retrieve a single list item by bookId, find one with specific id
function useListItem(bookId, options) {
  const listItems = useListItems(options)
  return listItems?.find(li => li.bookId === bookId) ?? null
}

function useListItems(options = {}) {
  const client = useClient()

  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items').then(data => data.listItems),
    ...options,
    config: {
      ...options.config,
      onSuccess: async listItems => {
        await options.config?.onSuccess?.(listItems)
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })
  return listItems ?? []
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

// this handle optimistic update for list items
// update cache with new item data
function onUpdateMutation(newItem) {
  const previousItems = queryCache.getQueryData('list-items')

  queryCache.setQueryData('list-items', old => {
    return old.map(item => {
      return item.id === newItem.id ? {...item, ...newItem} : item
    })
  })

  // rollback fn to restore in case of an error
  return () => queryCache.setQueryData('list-items', previousItems)
}

function useUpdateListItem(options) {
  const client = useClient()

  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
      }),
    {
      onMutate: onUpdateMutation,
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useRemoveListItem(options) {
  const client = useClient()

  return useMutation(({id}) => client(`list-items/${id}`, {method: 'DELETE'}), {
    onMutate: removedItem => {
      const previousItems = queryCache.getQueryData('list-items')

      queryCache.setQueryData('list-items', old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutationOptions,
    ...options,
  })
}

function useCreateListItem(options) {
  const client = useClient()

  return useMutation(({bookId}) => client('list-items', {data: {bookId}}), {
    ...defaultMutationOptions,
    ...options,
  })
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
