import React, { useState } from 'react'

export const EventAddForm = ({
  eventAdd
}) => {

  const [ eventTitle, setEventTitle ] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    eventAdd({
      title: eventTitle,
    })
    setEventTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Title
        <input
          type="text"
          value={eventTitle}
          onChange={e=>setEventTitle(e.target.value)}
        />
      </label>
      <button type="submit">Add Event</button>
    </form>
  )
}

export default EventAddForm
