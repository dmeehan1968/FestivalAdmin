import path from 'path'

export default config => {

  config
    .resolve
      .alias
      .set('app', path.resolve('src', 'app'))
      .set('server', path.resolve('src', 'server'))

}
