import React from 'react'
import TextField from '@material-ui/core/TextField'

import useValidation from 'app/hooks/useValidation'

const ValidatedTextField = ({ validations, ...props }) => {

  const validationProps = useValidation(validations, props.onChange)

  return (
    <TextField {...props} {...validationProps} />
  )
}

export default ValidatedTextField
