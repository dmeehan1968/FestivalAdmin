import React from 'react'

import Contact from 'app/components/Contact'

export const ContactList = ({
  contacts = []
}) => {

  if (contacts.length < 1) {
    return null
  }

  return (
    <ul>
      {contacts.map(contact => <Contact key={contact.id} contact={contact} />)}
    </ul>
  )
}

export default ContactList
