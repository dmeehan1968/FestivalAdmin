import React from 'react'
import { Link } from 'react-router-dom'

import { makeStyles, useTheme } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import MoreVertIcon from '@material-ui/icons/MoreVert'

import { useAuthentication } from 'app/components/AuthenticationProvider'

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '100%',
  },
}))

const CreateEventLink = React.forwardRef((props, ref)=><Link innerRef={ref} to="/event/create" {...props} />)

export const EventCreateCard = ({
}) => {
  const classes = useStyles()
  const { hasPermission } = useAuthentication()

  if (hasPermission('CreateEvents') || hasPermission('CreateOwnEvents')) {

    return (
      <Card>

        <CardHeader
          title="Create Event"
          titleTypographyProps={{ variant: 'subtitle1' }}
        />

        <CardActions>
          <Button
            component={CreateEventLink}
          >
            Create
          </Button>
        </CardActions>

      </Card>
    )

  }

  return null
}

export default EventCreateCard
