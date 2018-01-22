const router = require('koa-router')()
const index = require('../controllers/home')

module.exports = router.get('/', index)