import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { Helmet } from 'react-helmet'

import AdminAppBar from 'app/components/AdminAppBar'
import AdminAppDrawer from 'app/components/AdminAppDrawer'
import PageBar from 'app/components/PageBar'
import EventsGrid from 'app/components/EventsGrid'

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
  paper: {
    padding: theme.spacing(2),
  },
}))

export const Page = ({
  title,
  children,
}) => {
  const classes = useStyles()

  return (
    <>
      <PageBar title={title} />
      <Container maxWidth="lg" className={classes.container}>
        {children}
      </Container>
    </>
  )
}
export const AdminApp = ({

}) => {
  const classes = useStyles()
  const [ isDrawerOpen, setIsDrawerOpen ] = useState(true)
  const events = Array(10).fill({})
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
        <Switch>
          <Route exact path="/">
            <Page title="Your Profile">
              <div>Pending</div>
            </Page>
          </Route>
          <Route exact path="/events">
            <Page title="Events">
              <EventsGrid events={events}/>
            </Page>
          </Route>
          <Route>
            <Page title="Under Construction">
              <div>Not Yet Implemented</div>
            </Page>
          </Route>
        </Switch>
      </main>
    </div>
  )
}

export default AdminApp
