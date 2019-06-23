import React from 'react'
import { compose } from 'react-apollo'

import TextField from '@material-ui/core/TextField'

import withChangeNotification from 'app/hocs/withChangeNotification'
import withProgressAdornment from 'app/hocs/withProgressAdornment'
import withOnChangeDebounce from 'app/hocs/withOnChangeDebounce'
import withProps from 'app/hocs/withProps'

export const AutoSaveTextField = compose(
  withChangeNotification({ message: <span>Saved</span> }),
  withProgressAdornment,
  withOnChangeDebounce({ debounceDelayMs: 500}),
  withProps({
    label: 'Text Field',
    margin: 'normal',
    fullWidth: true,
  }),
)(TextField)

export default AutoSaveTextField
