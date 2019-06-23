import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'

export const withProgressAdornment = WrappedComponent => ({ updating, ...props}) => {
  return (
    <WrappedComponent
      {...props}
      InputProps={{
        ...props.InputProps,
        ...(updating && {endAdornment: <InputAdornment position="end">
          <CircularProgress size={19} />
        </InputAdornment>}),
      }}
    />
  )
}

export default withProgressAdornment
