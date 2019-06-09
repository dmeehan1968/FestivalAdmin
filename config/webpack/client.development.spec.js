import development from './client.development'
const cfg = development.toConfig()

describe('client development', () => {

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
})
