import Router from '@koa/router'
import { initialize } from 'koa-openapi'
import openapiDoc from './api-doc'
import cors from '@koa/cors'

const health = new Router()
const router = new Router()

initialize({
  router,
  basePath: '/health',
  apiDoc: openapiDoc,
  paths: [
    { path: '/apiDocs', module: require('./routes/apiDocs') },
    { path: '/', module: require('./routes') }
  ]
})

health.use(cors())
health.use('/health', router.routes(), router.allowedMethods({ throw: true }))

export default health
