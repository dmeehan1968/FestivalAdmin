import React from 'react'

// Core
import AppBar from '@material-ui/core/AppBar'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

export const PageBar = ({
  title = 'No Title'
}) => {
  return (
    <AppBar color="default" position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default PageBar
