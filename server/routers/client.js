/*
 * client 脚本
 */
const router = require('koa-router')()

const service = require('./../controllers/client')

const routers = router
    .get('/install/:id' , service.install)
    .get('/uninstall/:id' , service.uninstall)
    .get('/remove/:id' , service.remove)
    .post('/agent/:id' , service.agent)
    .post('/update' , service.update)
    
module.exports = routers
