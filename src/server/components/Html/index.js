import React from 'react'
import { Helmet } from 'react-helmet'

export const Html = ({
  children,
  styles = [],
  scripts = [],
}) => {
  const head = Helmet.renderStatic()
  return (
    <html>
      <head>
        {head.meta.toComponent()}
        {head.title.toComponent()}
        {head.base.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        {head.noscript.toComponent()}
        {head.style.toComponent()}
        {styles.map((style, key) => {
          if (typeof style === 'string') {
            return <link key={key} type="text/css" rel="stylesheet" href={style} />
          } else {
            return style
          }
        })}
      </head>
      <body>
        <div id="root">
          {children}
        </div>
        {scripts}
      </body>
    </html>
  )
}

export default Html
