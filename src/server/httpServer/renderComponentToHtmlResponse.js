import React from 'react'
import ReactDomServer from 'react-dom/server'

import Html from 'server/components/Html'
import withStylesheet from 'server/hocs/withStylesheet'
import withStaticRouter from 'server/hocs/withStaticRouter'
import withClientScripts from 'server/hocs/withClientScripts'

export const renderComponentToHtmlResponse = req => WrappedRootComponent => {

  const context = {}
  const manifest = req.app.get('manifest')

  const RenderRoot = withStylesheet(withClientScripts(manifest.clients)(Html), withStaticRouter(WrappedRootComponent))

  const payload = '<!doctype html>' + ReactDomServer.renderToString(
    <RenderRoot location={req.url} context={context}/>
  )

  return {
    status: context.status,
    payload: payload
  }

}

export default renderComponentToHtmlResponse
