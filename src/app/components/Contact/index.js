import React from 'react'

export const Contact = ({
  contact = {}
}) => {
  return (
    <li>{contact.firstName} {contact.lastName}</li>
  )
}

export default Contact
