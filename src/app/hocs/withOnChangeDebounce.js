import React, { useEffect, useState } from 'react'

export const withOnChangeDebounce = ({ debounceDelayMs }) => WrappedComponent => props => {

  const [ value, setValue ] = useState(props.value || '')

  useEffect(() => {

    if (value === props.value) return

    const timeout = setTimeout(() => {
      props.onChange && props.onChange({ target: { value }})
    }, debounceDelayMs)

    return () => clearTimeout(timeout)
  }, [ value ])

  return (
    <WrappedComponent
      {...props}
      onChange={ev=>setValue(ev.target.value)}
      value={value}
    />
  )
}

export default withOnChangeDebounce
