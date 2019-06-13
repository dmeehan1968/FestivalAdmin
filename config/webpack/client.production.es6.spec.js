import builder from './client.production.es6'

describe('client production es6', () => {

  let production

  beforeEach(() => {
    production = builder({})
  })

  describe('babel preset-env targets module-compatible browsers', () => {

    it('targets module-compatible browsers', () => {
      const loader = production.module.rule('compile').use('babel').loader('babel-loader')
      const preset = loader.get('options').presets.find(preset => preset[0] === '@babel/preset-env')
      const options = preset[1]
      expect(options.targets).toEqual({
        esmodules: true,
      })
    })
  })

  it('uses config name in output path', () => {
    expect(production.output.get('path')).toMatch(new RegExp(`${production.get('name')}/static$`))
  })

})
