import React from 'react'
import ReactDOM from 'react-dom'
import AdminApp from 'app/components/AdminApp'

console.log('Client loaded');

ReactDOM.hydrate((
  <AdminApp />
),
document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}
