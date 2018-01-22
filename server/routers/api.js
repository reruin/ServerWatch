/*
 * api 路由
 */
const router = require('koa-router')()

const account = require('../controllers/account')
const node = require('../controllers/node')
const signin = require('../controllers/signin')

const routers = router//.prefix('/api')
    // .post('/signin', user.signin)
    // .post('/signup', user.signup)

    .get('/nodes' , node.list)

    .get('/node/:id' , node.query)
    .get('/node/:id/latest' , node.queryLatest)
    .get('/node/:id/base' , node.queryBase)
    .get('/node/:id/remove' , node.remove)
    .post('/node/create' , node.create)
    
    .post('/node/:id' , node.update)



    .get('/setting' , account.setting)
    .post('/setting' , account.update)


    // .post('/signin' , account.signin)


module.exports = routers
