import React, { useState } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'

import { Helmet } from 'react-helmet'

import AdminAppBar from 'app/components/AdminAppBar'
import AdminAppDrawer from 'app/components/AdminAppDrawer'
import PageBar from 'app/components/PageBar'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: theme.mixins.toolbar,

}))

export const AdminApp = ({

}) => {
  const classes = useStyles()
  const [ isDrawerOpen, setIsDrawerOpen ] = useState(false)

  return (
    <div className={classes.root}>
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Helmet>
      <CssBaseline />
      <AdminAppBar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <AdminAppDrawer isDrawerOpen={isDrawerOpen} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <PageBar title="Page Heading" />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container>
            <Grid item>
              <p>This is some content</p>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}

export default AdminApp
