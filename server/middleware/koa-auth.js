const jwt = require('jsonwebtoken')
const print = require('../utils/print')

const auth = {
    check(ctx, next) {
        let token = ctx.request.header['authorization'] || ctx.request.query.key

        if (token) {
            try {
                let tokenData = jwt.verify(token, 'yueling')
                //是否过期
                if (tokenData && tokenData.exp <= new Date() / 1000) {
                  print.json(ctx, 401, 'invalid token')
                }else{
                  ctx.authData = tokenData;
                  return next()
                }
            } catch (err) {

                print.json(ctx, 401, 'invalid token')
            }
        } else {
          //ctx.throw(401, 'no token detected in http header 'Authorization'');
          print.json(ctx, 401, 'no token detected')
        }
    },

    create(cnt) {
      let token = jwt.sign(cnt , 'yueling' , {expiresIn:'1h'})
      return token
    }
}

module.exports = auth