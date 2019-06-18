import React from 'react'

export const Html = ({
  children,
  styles = [],
  scripts = [],
}) => {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
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
