import { useMemo } from 'react'

import * as yup from 'yup'

export const useLoginSchema = () => {
  return useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email('Must be a valid email address')
        .required('Email is required'),
      password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password should contain at least 8 characters')
        .matches(/[a-z]+/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]+/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]+/, 'Password must contain at least one number')
        .matches(/\W+/, 'Password must contain at least one non-word character')
    })
  })
}

export default useLoginSchema
