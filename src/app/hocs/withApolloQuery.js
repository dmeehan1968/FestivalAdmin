import React from 'react'
import { Query } from 'react-apollo'

const withApolloQuery = ({
  QueryProps,
  mapResultToProps = () => {},
  mapPropsToVariables = () => {},
}) => WrappedComponent => props => {
  return (
    <Query {...QueryProps} variables={{
      ...QueryProps.variables,
      ...mapPropsToVariables(props)
    }}>
      {result => {
        return (
          <WrappedComponent
            {...props}
            {...mapResultToProps(result)}
          />
        )
      }}
    </Query>
  )
}

export default withApolloQuery
