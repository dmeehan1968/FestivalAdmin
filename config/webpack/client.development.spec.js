import builder from './client.development'

describe('client development', () => {

  let development

  describe('with defaults', () => {

    beforeEach(() => {
      development = builder({})
    })

    it('operates in development mode', () => {
      expect(development.get('mode')).toEqual('development')
    })

    it('includes development in the name', () => {
      expect(development.get('name')).toMatch(/development/)
    })

    it('has source map support', () => {
      expect(development.get('devtool')).toEqual('source-map')
    })

    it('includes react-devtools', () => {
      expect(development.entry('bundle').values()).toContain('react-devtools')
    })

    it('uses config name in output path', () => {
      expect(development.output.get('path')).toMatch(new RegExp(`${development.get('name')}/static$`))
    })

  })

  describe('with HMR', () => {

    beforeEach(() => {
      development = builder({ withHMR: true })
    })

    it('includes HMR plugin', () => {
      expect(development.plugin('hmr').values()[1].name).toEqual('HotModuleReplacementPlugin')
    })

  })

})
