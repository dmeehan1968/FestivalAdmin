import path from 'path'

console.log(path.resolve())

export default config => {

  config
    .resolve
      .alias
      .set('root', path.resolve())
      .set('app', path.resolve('src', 'app'))
      .set('server', path.resolve('src', 'server'))

}
