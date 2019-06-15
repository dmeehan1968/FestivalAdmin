import { gql } from 'apollo-boost'

export default gql`
  query {
    events {
      id
      title
      contacts {
        id
        firstName
        lastName
      }
    }
  }
`
