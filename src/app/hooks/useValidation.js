import { useState } from 'react'

export const useValidation = (validations, wrappedOnChange) => {

  const [ helperText, setHelperText ] = useState()

  const onChange = ev => {
    const noop = () => {}
    try {
      (validations || noop)(ev.target.value)
      helperText && setHelperText(undefined)
    } catch(error) {
      setHelperText(error.message)
    }
    return (wrappedOnChange || noop)(ev)
  }

  return {
    onChange,
    helperText,
    error: !!helperText,
  }
}

export default useValidation
