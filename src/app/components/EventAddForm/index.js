import React, { useRef } from 'react'

export const EventAddForm = ({
  eventAdd
}) => {

  const eventTitleRef = useRef(null)

  const handleSubmit = e => {
    e.preventDefault()
    eventAdd({
      title: eventTitleRef.current.value,
    })
    eventTitleRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Title</label>
      <input type="text" ref={eventTitleRef} />
      <button type="submit">Add Event</button>
    </form>
  )
}

export default EventAddForm
