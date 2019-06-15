import { gql } from 'apollo-boost'

export default gql`
  mutation EventAdd($event: EventInput!) {
    eventAdd(Event:$event) {
      id
      title
      contacts {
        firstName
        lastName
      }
    }
  }
`
