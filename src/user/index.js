import Koa from 'koa'
import mount from 'koa-mount'
import request from 'superagent'
import { validate as isValidUUID } from 'uuid'

/**
 * Oauth grant config
 */

import grant from 'grant-koa'
import grantConfig from '../config/grant'

import logout from './logout'

/**
 * Swagger client for user-api
 */
import SwaggerClient from 'swagger-client'

const user = new Koa()

user.use(mount('/connect', grant(grantConfig)))

user.use(async (ctx, next) => {
  if (ctx.get('Authorization').startsWith('Bearer ')) {
    // bearer auth
    ctx.accessToken = ctx.get('Authorization').slice(7, ctx.get('Authorization').length).trimLeft()
  } else if (ctx.session.grant && ctx.session.grant.response) {
    // session auth
    ctx.accessToken = ctx.session.grant.response.access_token
  }

  await next()
})

user.use(async (ctx, next) => {
  if (!ctx.accessToken) {
    ctx.status = 401
    ctx.throw(401, 'Missing required access token')
  }

  if (!isValidUUID(ctx.accessToken)) {
    ctx.status = 401
    ctx.throw(401, 'Invalid access token')
  }

  try {
    let response

    const { href } = new URL('/v1/oauth/introspect', process.env.OAUTH_HOST)

    response = await request
      .post(href)
      .auth(process.env.OAUTH_CLIENT, process.env.OAUTH_SECRET)
      .type('form')
      .send({
        token: ctx.accessToken,
        token_type_hint: 'access_token'
      })

    const { user_id: id, scope } = response.body

    const specUrl = new URL('/user/user.swagger.json', process.env.USER_API_HOST) // user-api swagger docs
    const client = await new SwaggerClient({
      url: specUrl.href,
      authorizations: {
        bearer: 'Bearer ' + ctx.accessToken
      }
    })

    response = await client.apis.Users.ResonateUser_GetUser({
      id
    })

    const [role] = scope.split(' ').slice(-1) // expect last part of scope to be role

    ctx.profile = Object.assign({}, response.body, {
      id, // user api user id (uuid)
      role: role
    })
  } catch (err) {
    let message = err.message
    if (err.response) {
      // handle token expiration
      ctx.status = 401
      message = err.response.body.error
    }
    ctx.throw(ctx.status, message)
  }

  await next()
})

user.use(mount('/logout', logout))

export default user
