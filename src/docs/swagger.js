module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0',
    title: 'BAREFOOT NOMAD',
    description: 'Barefoot Nomad makes travel and accommodation easy and convenient'
  },
  schemes: [
    'https'
  ],
  host: 'https://barefoot-nomad.herokuapp.com/',
  basePath: '/api/v1',
  securityDefinitions: {
    Bearer: {
      type: 'bearer',
      name: 'Authorization',
      in: 'header'
    }
  },
  tags: [
    {
      name: 'auth',
      description: 'Handles Signup and Signin'
    }
  ],
  paths: {
    '/auth/signup': {
      post: {
        tags: [
          'auth'
        ],
        summary: 'Create a user account',
        description: '',
        consumes: [
          'application/json',
          'application/xml'
        ],
        produces: [
          'application/json'
        ],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  example: 'James'
                },
                lastName: {
                  type: 'string',
                  example: 'Doe'
                },
                email: {
                  type: 'string',
                  example: 'JDoe@email.com'
                },
                password: {
                  type: 'string',
                  example: 'secret'
                }
              }
            }
          }
        ],
        responses: {
          201: {
            description: 'successful operation; user created',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer'
                },
                data: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      example: '$4567yjnjfn645msfvjfnv.efghnjfnjvn'
                    },
                    id: {
                      type: 'integer',
                      example: 1
                    },
                    firstName: {
                      type: 'string',
                      example: 'Jean'
                    },
                    lastName: {
                      type: 'string',
                      example: 'Dee'
                    },
                    email: {
                      type: 'string',
                      example: 'JeanD@email.com'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad Request',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
};
