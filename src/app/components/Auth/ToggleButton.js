import React, { useState, useEffect } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

const useToggleButtonGroupStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'row nowrap',
    alignItems: 'flex-start',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    width: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    '&:first-child': {
      borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
    },
    '&:last-child': {
      borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
    },
  },
  small: {
    fontSize: '0.75rem',
  },
  medium: {
    // fontSize: '1rem',
  },
  large: {
    fontSize: '1.25rem',
  },
  selected: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    }
  },
}))

export const ToggleButtonGroup = ({
  children,
  variant,
  exclusive = false,
  value,
  onChange = () => {},
  size = 'medium',
  ...props
}) => {
  const classes = useToggleButtonGroupStyles()
  const [ selected, setSelected ] = useState(Array.isArray(value) ? value : [ value ])

  useEffect(() => {
    setSelected(Array.isArray(value) ? value : [ value ])
  }, [ value ])

  const handleClick = (ev, value) => {
    let newSelected
    if (exclusive) {
      newSelected = [ value ]
    } else {
      const index = selected.indexOf(value)
      if (index >= 0) {
        newSelected = selected.slice()
        newSelected.splice(index, 1)
      } else {
        newSelected = [ ...selected, value ]
      }
    }
    setSelected(newSelected)
    onChange(ev, newSelected.length === 0 ? null : newSelected.length === 1 ? newSelected[0] : newSelected)
  }

  return (
    <div {...props} className={clsx(classes.container, props.className)}>
      {
        React.Children.map(children, child => {
          return React.cloneElement(child, {
            variant,
            className: clsx(
              classes.button,
              classes[size],
              child.props.className,
              selected.includes(child.props.value) ? classes.selected : null
            ),
            onClick: ev=>handleClick(ev, child.props.value),
          })
        })
      }
    </div>
  )
}

export const ToggleButton = Button
