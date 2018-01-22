const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
const koaStatic = require('koa-static')

const session = require('koa-session-minimal')
const os = require('os')
const fs = require('fs')

const config = require('./config')

const routers = require('./routers/index')
const cors = require('@koa/cors')
const path = require('path')

const app = new Koa()

onerror(app)

app.use(cors())


// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())

let web_path = path.resolve(__dirname, '../build')

app.use(koaStatic(web_path))

app.use(views(web_path))


/*app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
*/

app.use(routers.routes()).use(routers.allowedMethods())


config.init(app)


module.exports = app
