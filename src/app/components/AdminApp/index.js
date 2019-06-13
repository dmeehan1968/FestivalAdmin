import React, { useEffect, useState } from 'react'

export const AdminApp = ({}) => {

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  })

  return (
    <>
      <h1>Hello World</h1>
      {isClient && <p>Client Loaded</p>}
    </>
  )

}

export default AdminApp
