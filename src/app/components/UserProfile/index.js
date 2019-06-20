import React, { useState } from 'react'
import faker from 'faker'
faker.locale = 'en_GB'

// Styles
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  }
}))

export const UserProfile = ({

}) => {
  const classes = useStyles()
  const [ user, setUser ] = useState({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    organisation: faker.company.companyName(),
    telephone: faker.phone.phoneNumber(),
    mobile: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    website: faker.internet.url(),
  })

  return (
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} md={6}>
        <Typography color="textSecondary" paragraph={true}>Personal Info</Typography>
        <Paper className={classes.paper}>
          <form className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="firstName"
                  label="First Name"
                  className={classes.textField}
                  fullWidth
                  margin="normal"
                  autoComplete="fname"
                  value={user.firstName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  className={classes.textField}
                  fullWidth
                  margin="normal"
                  autoComplete="lname"
                  value={user.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="organisation"
                  label="Organisation/Company Name"
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  autoComplete="organization"
                  value={user.organisation}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography color="textSecondary" paragraph={true}>Contact Details</Typography>
        <Paper className={classes.paper}>
          <form className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="telephone"
                  label="Telephone"
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  autoComplete="tel"
                  value={user.telephone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="mobile"
                  label="Mobile"
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  autoComplete="tel"
                  value={user.mobile}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  autoComplete="email"
                  value={user.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="website"
                  label="Website"
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  autoComplete="url"
                  value={user.website}
                />
              </Grid>
            </Grid>
            <div className={classes.buttons}>
              <Button variant="contained" className={classes.button}>
                Cancel
              </Button>
              <Button variant="contained" className={classes.button} color="primary">
                Save
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default UserProfile
