import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'

export default app => [
  (req, res, next) => {
    if (req.headers.authorization) {
      const matches = req.headers.authorization.match(/^Bearer: (.+)$/)
      if (matches && matches[1]) {
        const token = matches[1]
        if (token) {
          const rsaPrivateKey = fs.readFileSync(path.resolve('.rsa'))
          jwt.verify(
            token,
            rsaPrivateKey,
            { algorithms: [ 'RS256' ] },
            (err, user) => {
              if (err) throw err
              const { AuthUser } = app.get('models')
              AuthUser
              .findByPk(user.id)
              .then(user => req.user = user)
              .finally(next)
            }
          )
          return
        }
      }
    }
    next()
  },
]
