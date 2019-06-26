import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo-hooks'

export const eventsQuery = gql`
  query eventGet($id: Int!) {
  	events: eventGet(id: $id, limit: 1) {
      id
      title
      subtitle
      description
      longDescription
    }
  }
`

export const useEventGet = id => {

  const {
    data: {
      events: [
        event = { title: '', subtitle: '', description: '', longDescription: '' }
      ] = []
    } = {},
    ...rest
  } = useQuery(eventsQuery, { variables: { id }})

  return { event, ...rest }

}

export default useEventGet
