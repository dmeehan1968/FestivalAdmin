import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'

export default app => [
  (req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.match(/^Bearer: (.+)$/)[1]
      if (token) {
        const rsaPrivateKey = fs.readFileSync(path.resolve('.rsa'))
        jwt.verify(
          token,
          rsaPrivateKey,
          { algorithms: [ 'RS256' ] },
          (err, user) => {
            if (err) throw err
            console.log('auth_user', user);
            req.user = user
            next()
          }
        )
        return
      }
    }
    next()
  },
]
