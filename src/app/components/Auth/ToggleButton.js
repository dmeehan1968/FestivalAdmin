import React, { useState, useMemo } from 'react'

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
  exclusive = true,
  value,
  onChange = () => {},
  size = 'medium',
  ...props
}) => {
  const classes = useToggleButtonGroupStyles()
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
              child.props.value === value ? classes.selected : null
            ),
            onClick: ev=>onChange(ev, child.props.value),
          })
        })
      }
    </div>
  )
}

export const ToggleButton = ({
  ...props
}) => {
  return (
    <Button {...props} />
  )
}
