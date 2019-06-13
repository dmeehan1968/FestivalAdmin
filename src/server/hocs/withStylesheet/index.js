import React from 'react'

import { ServerStyleSheet } from 'styled-components'

export const withStylesheet = (WrapperComponent, WrappedComponent) => {
  const stylesheet = new ServerStyleSheet()
  return props => {
    let result = null
    try {
      result = stylesheet.collectStyles(<WrappedComponent {...props} />)
    } catch(error) {
      throw error
    } finally {
      stylesheet.seal()
    }
    const styles = stylesheet.getStyleElement()
    return <WrapperComponent styles={styles}>{result}</WrapperComponent>
  }
}

export default withStylesheet
