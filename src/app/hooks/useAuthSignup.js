import { gql } from 'apollo-boost'
import { useMutation } from 'react-apollo-hooks'

export const AuthSignipMutation = gql`
  mutation signup($credentials:SignupInput!) {
    signup(SignupInput:$credentials) {
      token
    }
  }
`
export const useAuthSignup = options => {

  const [mutation] = useMutation(AuthSignipMutation, options)

  return (email, password, confirmPassword) => {
    const options = { variables: { credentials: { email, password, confirmPassword } } }
    return mutation(options)
    .then(({
      data: {
        signup: {
          token
        } = {},
      } = {}
    }) => token)
  }

}

export default useAuthSignup
