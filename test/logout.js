const test = require('tape')
const Koa = require('koa')
const mount = require('koa-mount')
const supertest = require('supertest')
const destroyable = require('server-destroy')
const error = require('koa-json-error')
const path = require('path')
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'test-logout' },
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    })
  ]
})

require('dotenv-safe').config({ path: path.join(__dirname, '../.env') })

const logout = require('../lib/user/logout')

const app = new Koa()

app.use(error(err => {
  return {
    status: err.status,
    message: err.message,
    data: null
  }
}))

app.use(async (ctx, next) => {
  try {
    ctx.profile = { role: 'user' }
  } catch (err) {
    ctx.throw(ctx.status, err.message)
  }

  await next()
})
app.use(mount('/logout', logout))

let server
let request

test('start', t => {
  server = app.listen(5557, () => {
    logger.info('test server started')
  })
  destroyable(server)
  request = supertest(server)
  t.end()
})

test('should redirect with 302', async t => {
  t.plan(2)

  try {
    await request
      .get('/logout')
      .expect(302)

    t.pass('ok')
  } catch (err) {
    t.end(err)
  }
})

test('shutdown', t => {
  server.close()
  t.end()
  process.exit(0)
})
