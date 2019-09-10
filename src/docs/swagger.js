module.exports = {
  swagger: '2.0',
  info: {
    version: '1.0',
    title: 'BAREFOOT NOMAD',
    description: 'Barefoot Nomad makes travel and accommodation easy and convenient'
  },
  schemes: [
    'https',
    'http'
  ],
  host: 'barefoot-nomad.herokuapp.com/',
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
            description: 'Bad Request: Some fields are empty or invalid data format',
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
    },
    '/auth/verifyuser': {
      post: {
        tags: [
          'auth'
        ],
        summary: 'Verifies if a client is an actual user',
        description: '',
        consumes: [
          'req.query parameters',
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
              $ref: '#definitions/ResetPassword',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/sendEmail',
            },
          },
          400: {
            description: 'Validation error in the password reset route',
            schema: {
              $ref: '#definitions/PasswordResetValidationResponse',
            },
          },
        },
      },
    },
    '/auth/signin': {
      post: {
        tags: [
          'auth'
        ],
        summary: 'Logs in a user',
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
          200: {
            description: 'successful operation; user successfully logged in',
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
    },
    '/auth/sendEmail': {
      post: {
        tags: ['auth'],
        summary: 'Send a password reset link to a registered user\'s email',
        description: '',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'body',
            required: true,
            schema: {
              $ref: '#definitions/SendEmail',
            },
          },
        ],
        responses: {
          200: {
            description: 'successfully sends a password reset mail',
            schema: {
              $ref: '#definitions/MailSentResponse',
            },
          },
          404: {
            description: 'Email Not Found',
            schema: {
              $ref: '#definitions/EmailNotFoundResponse',
            },
          },
          400: {
            description: 'Invalid Request Object',
            schema: {
              $ref: '#definitions/EmailInvalidResponse',
            },
          },
        },
      },
    },
    '/auth/resetPassword': {
      get: {
        tags: ['auth'],
        summary: 'Reset User Password',
        produces: ['application/json'],
        parameters: [
          {
            name: 'query',
            in: 'query',
            description: 'token containing the current user\'s email',
            required: true,
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Iml5YXJhZmVyZ3Vzb25AZ21haWwuY29tIiwiaWF0IjoxNTY2NDAzMTA3LCJleHAiOjE1NjY0ODk1MDd9.jDq8clsqJtTBN0-PKLJdu0U2GihHDCtn5P90aO0CHAs',
          },
          {
            in: 'body',
            name: 'body',
            description: 'body',
            required: true,
            schema: {
              $ref: '#definitions/ResetPassword',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation; user verified',
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
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Not authorized',
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
    },
    '/auth/logout': {
      post: {
        tags: ['logout'],
        summary: 'This route logs user out',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Authorization token to get user',
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'Success. User successfully signed out',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer'
                },
                data: {
                  type: 'string'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
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
          },
          400: {
            description: 'Bad request',
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
    },
    '/auth/edit': {
      patch: {
        tags: ['edit profile'],
        summary: 'Edits user profile',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Bearer token',
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'User has successfully edited profile',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer'
                },
                data: {
                  type: 'object'
                }
              }
            }
          },
          400: {
            description: 'Bad request',
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
          },
          401: {
            description: 'Unauthorized',
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
    },
    '/request': {
      post: {
        tags: [
          'request'
        ],
        summary: 'Create a travel request',
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
                passportName: {
                  type: 'string',
                  example: 'James'
                },
                reason: {
                  type: 'string',
                  example: 'shopping'
                },
                type: {
                  type: 'string',
                  example: 'one-way'
                },
                from: {
                  type: 'string',
                  example: 'lagos'
                },
                to: {
                  type: 'string',
                  example: 'kano'
                },
                departureDate: {
                  type: 'date',
                  example: '2018-03-29T13:34:00.000'
                },
                accommodation: {
                  type: 'string',
                  example: 'hotel presidential'
                }
              }
            }
          }
        ],
        responses: {
          201: {
            description: 'successful operation; request created',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer'
                },
                data: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      example: 1
                    },
                    passportName: {
                      type: 'string',
                      example: 'James'
                    },
                    reason: {
                      type: 'string',
                      example: 'shopping'
                    },
                    type: {
                      type: 'string',
                      example: 'one-way'
                    },
                    from: {
                      type: 'string',
                      example: 'lagos'
                    },
                    to: {
                      type: 'string',
                      example: 'kano'
                    },
                    departureDate: {
                      type: 'date',
                      example: '2018-03-29T13:34:00.000'
                    },
                    accommodation: {
                      type: 'string',
                      example: 'hotel presidential'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad Request: Some fields are empty or invalid data format',
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
    },
    '/request/:requestId/comment': {
      post: {
        tags: [
          'comment'
        ],
        summary: 'Create comment about a request',
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
                commentBody: {
                  type: 'string',
                  example: 'Another reason am embarking on this trip is for my professional update course'
                }
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'Permissions have been set for a role',
            201: {
              description: 'successful operation; comment created',
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string'
                  },
                  data: {
                    type: 'object',
                    properties: {
                      commentBody: {
                        type: 'string',
                        example: 'test commentitis'
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string'
                  },
                  error: {
                    type: 'string'
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized',
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
            },
            403: {
              description: 'Forbidden request',
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string'
                  },
                  error: {
                    type: 'string'
                  }
                }
              }
            },
            404: {
              description: 'Resource endpoint does not exist',
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string'
                  },
                  error: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      },
    },
    '/role': {
      patch: {
        tags: ['role & permissions'],
        summary: 'Assigns roles to users',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Bearer token',
            type: 'string'
          },
          {
            in: 'body',
            name: 'body',
            description: 'body',
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  example: 'JDoe@email.com'
                },
                role: {
                  type: 'string',
                  example: 'manager'
                }
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'User has been assigned a role',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                data: {
                  type: 'object'
                }
              }
            }
          },
          400: {
            description: 'Bad request',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
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
    },
    '/role/permissions': {
      patch: {
        tags: ['role & permissions'],
        summary: 'Sets permissions for roles targeting particular resource endpoints',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Bearer token',
            type: 'string'
          },
          {
            in: 'body',
            name: 'body',
            description: 'body',
            schema: {
              type: 'object',
              properties: {
                role: {
                  type: 'string',
                  example: 'manager'
                },
                resource: {
                  type: 'string',
                  example: 'accomodation'
                },
                create: {
                  type: 'boolean',
                  example: 'false'
                },
                read: {
                  type: 'boolean',
                  example: 'true'
                },
                update: {
                  type: 'boolean',
                  example: 'false'
                },
                delete: {
                  type: 'boolean',
                  example: 'false'
                },
              },
            },
          },
        ],
      },
    },
    '/accommodation': {
      post: {
        tags: ['accommodation & rooms'],
        summary: 'Creates an accommodation facility',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Bearer token',
            type: 'string'
          },
          {
            in: 'body',
            name: 'body',
            description: 'body',
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Century House'
                },
                location: {
                  type: 'string',
                  example: 'Southern Bay'
                }
              }
            }
          },
          {
            in: 'formData',
            name: 'image',
            description: 'image of the accommodation',
            type: 'file'
          }
        ],
        responses: {
          200: {
            description: 'Accommodation has been successfully created',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                data: {
                  type: 'object'
                }
              }
            }
          },
          400: {
            description: 'Bad request',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          403: {
            description: 'Forbidden',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          404: {
            description: 'Not found',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['accommodation & rooms'],
        summary: 'View all accommodation facilities',
        produces: ['application/json'],
        responses: {
          200: {
            description: 'success',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                data: {
                  type: 'object'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
        }
      }
    },
    '/accommodation/:accommodationId': {
      get: {
        tags: ['accommodation & rooms'],
        summary: 'View a specific accommodation facility',
        produces: ['application/json'],
        responses: {
          200: {
            description: 'Accommodation has been successfully created',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                data: {
                  type: 'object'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
        }
      },
    },
    '/accommodation/:accommodationId/room': {
      post: {
        tags: ['accommodation & rooms'],
        summary: 'Creates a room in an accommodation facility',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Bearer token',
            type: 'string'
          },
          {
            in: 'body',
            name: 'body',
            description: 'body',
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Century House'
                },
                type: {
                  type: 'string',
                  example: 'Southern Bay'
                }
              }
            }
          },
        ],
        responses: {
          200: {
            description: 'Room has been successfully added',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                data: {
                  type: 'object'
                }
              }
            }
          },
          400: {
            description: 'Bad request',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          403: {
            description: 'Forbidden',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          404: {
            description: 'Not found',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['accommodation & rooms'],
      summary: 'Creates a room in an accommodation facility',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Authorization',
          in: 'headers',
          description: 'Bearer token',
          type: 'string'
        },
        {
          in: 'body',
          name: 'body',
          description: 'body',
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Century House'
              },
              type: {
                type: 'string',
                example: 'Southern Bay'
              }
            }
          }
        },
      ],
      responses: {
        200: {
          description: 'Room has been successfully added',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string'
              },
              data: {
                type: 'object'
              }
            }
          }
        },
        400: {
          description: 'Bad request',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string'
              },
              error: {
                type: 'string'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string'
              },
              error: {
                type: 'string'
              }
            }
          }
        },
        403: {
          description: 'Forbidden',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string'
              },
              error: {
                type: 'string'
              }
            }
          }
        },
        404: {
          description: 'Not found',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string'
              },
              error: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    '/accommodation:accommodationId/room/:roomId': {
      get: {
        tags: ['accommodation & rooms'],
        summary: 'Operations on accommodations',
        produces: ['application/json'],
        responses: {
          200: {
            description: 'Accommodation has been successfully created',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                data: {
                  type: 'object'
                }
              }
            }
          },
          400: {
            description: 'Bad request',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          403: {
            description: 'Forbidden',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          },
          404: {
            description: 'Not found',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                error: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    definitions: {
      SendEmail: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'fergusoniyara@gmail.com',
          }
        },
      },
      ResetPassword: {
        type: 'object',
        properties: {
          password: {
            type: 'string',
            example: 'Password@2018',
          },
          confirmPassword: {
            type: 'string',
            example: 'Password@2018',
          }
        },
      },
      MessageSentResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            example: 200,
          },
          data: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'A verification has been sent to your email. Kindly follow that link to reset your password',
              },
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Iml5YXJhZmVyZ3Vzb25AZ21haWwuY29tIiwiaWF0IjoxNTY2NDAzMTA3LCJleHAiOjE1NjY0ODk1MDd9.jDq8clsqJtTBN0-PKLJdu0U2GihHDCtn5P90aO0CHAs',
              },
            },
          },
        },
      },
      PasswordResetResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            example: 200,
          },
          data: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Password reset successful',
              }
            },
          },
        },
      },
      EmailNotFoundResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            example: 404,
          },
          error: {
            type: 'string',
            example: 'No User with the provided email'
          },
        },
      },
      PasswordResetValidationResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            example: 400,
          },
          error: {
            type: 'string',
            example: 'Password must contain at least one number'
          },
        },
      },
      EmailInvalidResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            example: 400,
          },
          error: {
            type: 'string',
            example: 'Invalid email supplied'
          },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          commentBody: {
            type: 'string',
            example: 'I just have to be granted this request, let me go and chill',
          }
        },
      },
    },
  }
};
