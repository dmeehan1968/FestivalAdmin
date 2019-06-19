import React from 'react'

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

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '100%',
  },
}))

export const EventCard = ({
  event = {},
}) => {
  const classes = useStyles()

  return (
    <Card>

      <CardHeader
        title={event.title}
        subheader={event.subtitle}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      />

      {event.preferred_image &&
        <CardMedia
          className={classes.media}
          image={event.preferred_image.url}
          title={event.preferred_image.title}
        />
      }
      <CardActions>
        <Button>Select</Button>
      </CardActions>

    </Card>
  )
}

export default EventCard
