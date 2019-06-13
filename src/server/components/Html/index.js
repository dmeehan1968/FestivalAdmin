import React from 'react'

export const Html = ({
  children,
  styles = [],
  scripts = [],
}) => {
  return (
    <html>
      <head>
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
