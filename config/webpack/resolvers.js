import path from 'path'

export default config => {

  config
    .resolve
      .alias
      .set('app', path.resolve(process.cwd(), 'src', 'app'))
      .set('server', path.resolve(process.cwd(), 'src', 'server'))

}
