import React, { useState } from 'react'

import Snackbar from '@material-ui/core/Snackbar'

export const withChangeNotification = (SnackbarProps) => WrappedComponent => props => {

  const [ saveNotification, setSaveNotification ] = useState({ open: false })
  const noop = () => {}
  const onChange = ev => {
    return Promise
      .resolve((props.onChange || noop)(ev))
      .then(setSaveNotification({ open: true, key: Math.random() }))
  }

  return (
    <>
      <Snackbar
        autoHideDuration={1000}
        {...SnackbarProps}
        open={saveNotification.open}
        key={saveNotification.key}
        onClose={() => setSaveNotification({ open: false })}
      />
      <WrappedComponent {...props} onChange={onChange} />
    </>
  )
}

export default withChangeNotification
