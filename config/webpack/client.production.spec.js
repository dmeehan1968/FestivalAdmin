import builder from './client.production'

describe('client production', () => {

  let production

  beforeEach(() => {
    production = builder({})
  })

  it('includes production in the name', () => {
    expect(production.get('name')).toMatch(/production/)
  })

  it('operates in production mode', () => {
    expect(production.get('mode')).toEqual('production')
  })

  it('does not have source map support', () => {
    expect(production.get('devtool')).toEqual('none')
  })

  describe('babel preset-env targets legacy browsers', () => {

    it('targets legacy browsers', () => {
      const loader = production.module.rule('compile').use('babel').loader('babel-loader')
      const preset = loader.get('options').presets.find(preset => preset[0] === '@babel/preset-env')
      const options = preset[1]
      expect(options.targets).toBe('> 0.25%, not dead')
    })
  })

  it('uses config name in output path', () => {
    expect(production.output.get('path')).toMatch(new RegExp(`${production.get('name')}/static$`))
  })

})
