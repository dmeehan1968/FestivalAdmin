import React, { useState, useMemo } from 'react'

import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import Field from 'app/components/Field'

export const PasswordField = props => {

  const [ showPassword, setShowPassword ] = useState(false)

  return (
    <Field
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={ev=>setShowPassword(!showPassword)}
            >
              {showPassword && <VisibilityOff /> || <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
      {...props}
    />
  )
}

export default PasswordField
