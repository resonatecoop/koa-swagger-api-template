import { UserAPI as sequelize } from '../../db/models'

export default function () {
  const operations = {
    GET
  }

  async function GET (ctx, next) {
    try {
      await sequelize.query(`
        SELECT 1=1
      `, {
        type: sequelize.QueryTypes.SELECT
      })

      ctx.body = {
        healthy: true
      }
    } catch (err) {
      ctx.throw(ctx.status, err.message)
    }

    await next()
  }

  GET.apiDoc = {
    operationId: 'getHealthStatus',
    description: 'Check database health status',
    summary: 'Get health status',
    tags: ['health'],
    produces: [
      'application/json'
    ],
    responses: {
      400: {
        description: 'Bad request',
        schema: {
          $ref: '#/responses/BadRequest'
        }
      },
      404: {
        description: 'Not found',
        schema: {
          $ref: '#/responses/NotFound'
        }
      },
      default: {
        description: 'error payload',
        schema: {
          $ref: '#/definitions/Error'
        }
      }
    }
  }

  return operations
}
