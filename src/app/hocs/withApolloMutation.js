import React from 'react'
import { Mutation } from 'react-apollo'

export const withApolloMutation = ({
  MutationProps,
  mapMutateToProps = () => {},
  mapResultToProps = () => {},
}) => WrappedComponent => props => {
  return (
    <Mutation {...MutationProps}>
      {(mutate, result) => {
        return (
          <WrappedComponent
            {...props}
            {...mapMutateToProps(mutate)}
            {...mapResultToProps(result, props)}
          />
        )
      }}
    </Mutation>
  )
}

export default withApolloMutation
