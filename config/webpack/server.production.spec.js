import production from './server.production'

describe('server production', () => {

  it('operates in production mode', () => {
    expect(production.get('mode')).toEqual('production')
  })

  it('is based on server base', () => {
    expect(production.get('name')).toMatch(/^server.base/)
  })

  it('includes production in the name', () => {
    expect(production.get('name')).toMatch(/production/)
  })

  it('uses config name in output path', () => {
    expect(production.output.get('path')).toMatch(new RegExp(`${production.get('name')}$`))
  })
})
