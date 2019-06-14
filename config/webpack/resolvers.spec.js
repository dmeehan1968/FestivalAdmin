import path from 'path'

import Config from 'webpack-chain'

import resolvers from './resolvers'

describe('resolvers', () => {

  let config

  beforeEach(() => {
    config = new Config()
    resolvers(config)
  })

  it('aliases app', () => {

    expect(config.resolve.alias.get('app')).toBe(path.resolve('src', 'app'))

  })

  it('aliases server', () => {

    expect(config.resolve.alias.get('server')).toBe(path.resolve('src', 'server'))

  })

})
