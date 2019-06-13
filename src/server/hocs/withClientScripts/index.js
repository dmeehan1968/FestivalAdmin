import fs from 'fs'
import path from 'path'

import React from 'react'

export const loadServerManifest = buildDir => {
  const manifestIndexPath = path.resolve(buildDir, 'clients.json')
  return JSON.parse(fs.readFileSync(manifestIndexPath))
}

export const getClientScripts = clients => {
  return clients.reduce((acc, client, clientIndex) => {
    const manifest = JSON.parse(fs.readFileSync(client.manifest))
    return [ ...acc,
      ...Object.keys(manifest)
        .filter(key => /\.js$/.test(key))
        .map(key => {
          if (client.module) {
            return <script key={clientIndex+key} type="module" src={manifest[key]} />
          } else {
            return <script key={clientIndex+key} noModule={true} type="text/javascript" src={manifest[key]} />
          }
        })
      ]
  }, [])
}

export const withClientScripts = (WrappedComponent) => {
  return (props) => {
    const clients = loadServerManifest(__dirname)
    const scripts = getClientScripts(clients)

    return (
      <WrappedComponent scripts={scripts} {...props} />
    )
  }
}

export default withClientScripts
