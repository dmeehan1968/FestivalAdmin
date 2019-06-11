import builder from './server.development'

describe('server development', () => {

  let development

  describe('default config', () => {

    beforeEach(() => {
      development = builder({})
    })

    it('operates in development mode', () => {
      expect(development.get('mode')).toEqual('development')
    })

    it('includes development in the name', () => {
      expect(development.get('name')).toMatch(/development/)
    })

    it('uses config name in output path', () => {
      expect(development.output.get('path')).toMatch(new RegExp(`${development.get('name')}/static$`))
    })

    describe('source map support', () => {

      let plugin

      beforeEach(() => {
        plugin = development.plugin('banner')
      })

      it('has source map support', () => {
        expect(development.get('devtool')).toEqual('source-map')
      })

      it('uses BannerPlugin with source map support', () => {
        expect(plugin.values()[1].name).toBe('BannerPlugin')
        expect(plugin.values()[2]).toEqual([
          {
            banner: 'require("source-map-support").install();',
            test: /\.js$/,
            raw: true,
            entryOnly: false
          }
        ])
      })
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
