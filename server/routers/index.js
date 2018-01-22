const router = require('koa-router')()

const api = require('./api')

const home = require('./home')

const signin = require('./signin')

const client = require('./client')

const authorize = require('../middleware/koa-auth').check

router.use('/api', signin.routes(), signin.allowedMethods())

//token 验证
router.use('/api', authorize, api.routes(), api.allowedMethods())

router.use('/client',client.routes(),client.allowedMethods())

router.use(home.routes(), home.allowedMethods())

module.exports = router
