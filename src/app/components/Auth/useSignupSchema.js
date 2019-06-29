import * as yup from 'yup'

import useLoginSchema from './useLoginSchema'

export const useSignupSchema = () => {
  const loginSchema = useLoginSchema()

  return loginSchema.shape({
    confirmPassword: yup
      .reach(loginSchema, 'password')
      .oneOf([yup.ref('password')], 'Passwords must match')
  })
}

export default useSignupSchema
