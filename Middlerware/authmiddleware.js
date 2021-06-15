const moment = require('moment')
const jwt = require('jsonwebtoken')
const config = require('./../config')

class AuthMiddleware {
    /**
     * Create JWT token
     * @param {*} user
     */
    static createJWT(user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(2, 'days').unix()
        }
        console.log(payload)
        return jwt.sign(payload, config.SECRET_TOKEN)
    }

    /**
     * Decode JWT
     * @param {*} token
     */
    static decodeJWT(token) {
        console.log(token)
        return jwt.verify(token, config.SECRET_TOKEN)
    }
}
module.exports = { AuthMiddleware }
