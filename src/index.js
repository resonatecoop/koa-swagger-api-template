import Koa from 'koa'
import logger from 'koa-logger'
import compress from 'koa-compress'
import error from 'koa-json-error'
import mount from 'koa-mount'
import etag from 'koa-etag'
import session from 'koa-session'
import koaCash from 'koa-cash'
import { koaSwagger } from 'koa2-swagger-ui'
import cors from '@koa/cors'

import KeyGrip from 'keygrip'

import koaCashConfig from './config/cache'
import errorConfig from './config/error'
import compressConfig from './config/compression'
import sessionConfig from './config/session'

/**
 * Koa apps
 */
import health from './health'
import user from './user'

const app = new Koa({
  keys: new KeyGrip([process.env.APP_KEY, process.env.APP_KEY_2], 'sha256'),
  proxy: true
})

const origins = [
  'http://localhost:8080',
  'https://localhost:8080'
]

app
  .use(logger())
  .use(session(sessionConfig, app))
  .use(compress(compressConfig()))
  .use(error(errorConfig()))
  .use(koaSwagger({
    swaggerOptions: {
      urls: [
        {
          url: '/health/apiDocs?type=apiDoc&basePath=/health',
          name: 'Health API Service'
        }
      ]
    }
  })) // swagger-ui at /docs
  .use(koaCash(koaCashConfig()))
  .use(etag()) // required for koa-cash to propertly set 304
  .use(cors({
    origin: async (req) => {
      if (req.header.origin && origins.includes(req.header.origin)) return req.header.origin
    },
    credentials: true,
    headers: ['Content-Type', 'Authorization']
  }))

app.use(health.routes())
app.use(mount('/user', user))

export default app
