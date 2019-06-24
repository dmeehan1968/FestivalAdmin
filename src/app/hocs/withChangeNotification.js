import React, { useState } from 'react'

import Snackbar from '@material-ui/core/Snackbar'

const Span = props => <span {...props} />

export const withChangeNotification = (
  SnackbarProps,
  {
    SuccessComponent = Span,
    ErrorComponent = Span,
  } = {}
) => WrappedComponent => props => {

  const [ notification, setNotification ] = useState({ open: false })
  const noop = () => {}
  const onChange = ev => {
    return Promise
      .resolve((props.onChange || noop)(ev))
      .finally(() => setNotification({ open: true, key: Math.random() }))
      .catch(()=>{})
  }

  return (
    <>
      <Snackbar
        autoHideDuration={1000}
        {...SnackbarProps}
        message={error ? <ErrorComponent>{error}</ErrorComponent> : <SuccessComponent>Saved</SuccessComponent>}
        open={notification.open}
        key={notification.key}
        onClose={() => setNotification({ open: false })}
      />
      <WrappedComponent
        {...props}
        onChange={onChange}
      />
    </>
  )
}

export default withChangeNotification
