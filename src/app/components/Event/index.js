import React from 'react'

import ContactList from 'app/components/ContactList'

export const Event = ({
  event = {}
}) => {
  return (
    <li>
      {event.title}
      {event.contacts && event.contacts.length && <ContactList contacts={event.contacts} /> || null}
    </li>
  )
}

export default Event
