const router = require('koa-router')()
const service = require('../controllers/account')

const routers = router.post('/signin' , service.signin)

module.exports = routers