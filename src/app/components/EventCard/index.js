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

import faker from 'faker'

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
  const fakeTitle = (options = { min: 2, max: 8 }) => {
    return faker.lorem.words(faker.random.number(options)).replace(/\b\w/g, l => l.toUpperCase())
  }
  const {
    id = faker.random.number(),
    title = fakeTitle(),
    subtitle = fakeTitle(),
    preferred_image = {
      url: faker.image.imageUrl(300, 300, undefined, true),
      title: fakeTitle(),
    }
  } = event

  return (
    <Card>

      <CardHeader
        title={title}
        titleTypographyProps={{ variant: 'subtitle1' }}
        subheader={subtitle}
        subheaderTypographyProps={{ variant: 'subtitle2' }}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      />

      {preferred_image &&
        <CardMedia
          className={classes.media}
          image={preferred_image.url}
          title={preferred_image.title}
        />
      }
      <CardActions>
        <Button>Select</Button>
      </CardActions>

    </Card>
  )
}

export default EventCard
