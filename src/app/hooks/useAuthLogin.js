import { gql } from 'apollo-boost'
import { useMutation } from 'react-apollo-hooks'

export const AuthLoginMutation = gql`
  mutation login($credentials:LoginInput!) {
    login(LoginInput:$credentials) {
      token
    }
  }
`
export const useAuthLogin = options => {

  const mutation = useMutation(AuthLoginMutation, options)

  return (email, password) => {
    const options = { variables: { credentials: { email, password } } }
    return mutation(options)
    .then(({
      data: {
        login: {
          token
        } = {},
      }
    }) => token)
  }

}

export default useAuthLogin
