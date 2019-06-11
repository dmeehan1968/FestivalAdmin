import builder from './server.production'

describe('server production', () => {

  let production

  beforeEach(() => {
    production = builder({})
  })

  it('operates in production mode', () => {
    expect(production.get('mode')).toEqual('production')
  })

  it('includes production in the name', () => {
    expect(production.get('name')).toMatch(/production/)
  })

  it('uses config name in output path', () => {
    expect(production.output.get('path')).toMatch(new RegExp(`${production.get('name')}/static$`))
  })
})
