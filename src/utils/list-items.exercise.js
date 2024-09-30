import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from './api-client'

// hook for getting all the list items
function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
  })
  return listItems ?? []
}

// hook for getting a specific book
function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) ?? null
}

export {useListItems, useListItem}
