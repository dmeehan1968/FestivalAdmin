import { gql } from 'apollo-boost'
import { useMutation } from 'react-apollo-hooks'

export const eventMutation = gql`
  mutation EventEdit($event:EventInput) {
    event: eventEdit(Event:$event) {
      title
      subtitle
      description
      longDescription
    }
  }
`
export const useEventEdit = () => {

  const mutation = useMutation(eventMutation)

  return event => {
    delete event.__typename
    const options = { variables: { event } }
    return mutation(options)
    .then(({
      data: {
        event: {
          __typename: _,  // discard
          ...event
        } = {},
      }
    }) => event)
  }

}

export default useEventEdit
