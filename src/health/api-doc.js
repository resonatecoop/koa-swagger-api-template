const apiDoc = {
  swagger: '2.0',
  info: {
    title: 'Health API',
    version: '1.0.0-0'
  },
  definitions: {
    Error: {
      type: 'object',
      properties: {
        code: {
          type: 'string'
        },
        message: {
          type: 'string'
        }
      },
      required: [
        'code',
        'message'
      ]
    }
  },
  responses: {
    BadRequest: {
      description: 'Bad request',
      schema: {
        $ref: '#/definitions/Error'
      }
    },
    NotFound: {
      description: 'No label profiles were found.',
      schema: {
        $ref: '#/definitions/Error'
      }
    }
  },
  paths: {},
  tags: [{ name: 'health' }]
}

export default apiDoc
