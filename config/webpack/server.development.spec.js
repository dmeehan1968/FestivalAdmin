import builder from './server.development'

describe('server development', () => {

  let development

  beforeEach(() => {
    development = builder({})
  })

  it('operates in development mode', () => {
    expect(development.get('mode')).toEqual('development')
  })

  it('is based on server base', () => {
    expect(development.get('name')).toMatch(/^server.base/)
  })

  it('includes development in the name', () => {
    expect(development.get('name')).toMatch(/development/)
  })

  it('uses config name in output path', () => {
    expect(development.output.get('path')).toMatch(new RegExp(`${development.get('name')}$`))
  })
})
