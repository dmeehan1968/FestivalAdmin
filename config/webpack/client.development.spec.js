import builder from './client.development'

describe('client development', () => {

  let development

  beforeEach(() => {
    development = builder({})
  })

  it('operates in development mode', () => {
    expect(development.get('mode')).toEqual('development')
  })

  it('is based on client base', () => {
    expect(development.get('name')).toMatch(/^client.base/)
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
    expect(development.output.get('path')).toMatch(new RegExp(`${development.get('name')}$`))
  })
})
