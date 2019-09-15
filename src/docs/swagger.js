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
  host: 'barefoot-nomad.herokuapp.com',
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
    '/request/search': {
      get: {
        tags: [
          'request'
        ],
        summary: 'Search for a request',
        description: '',
        consumes: [
          'application/json',
        ],
        parameters: [
          {
            in: 'query',
            name: 'column-data e.g., type=one-way&status=approved',
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/UpdateSuccessful',
            },
          }
        }
      }
    },
    '/request/:id': {
      patch: {
        tags: [
          'request'
        ],
        summary: 'Edit a created request',
        description: '',
        consumes: [
          'application/json',
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
          },
          {
            in: 'body',
            name: 'body',
            description: 'body',
            required: true,
            schema: {
              $ref: '#definitions/CreateRequest',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/UpdateSuccessful',
            },
          },
          400: {
            description: 'Validation error',
            schema: {
              $ref: '#definitions/RequestValidationResponse',
            },
          },
          403: {
            description: 'Validation error',
            schema: {
              $ref: '#definitions/UserRightsResponse',
            },
          },
          404: {
            description: 'Validation error',
            schema: {
              $ref: '#definitions/RequestNotFoundResponse',
            },
          }
        }
      }
    },
    '/trip/:id': {
      delete: {
        tags: [
          'trip'
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/TripDeletedResponse',
            },
          },
          400: {
            description: 'Invalid trip id supplied',
            schema: {
              $ref: '#definitions/TripValidationResponse',
            },
          },
          404: {
            description: 'Validation error',
            schema: {
              $ref: '#definitions/RequestNotFoundResponse',
            },
          }
        },
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
      },
      get: {
        tags: ['comment'],
        summary: 'Allows a user to view all comment(s) related to a request',
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
            description: 'An array of all comment(s) related to  request',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                data: {
                  type: 'array'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized, "no token provided"',
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
                data: {
                  type: 'object'
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
      }
    },
    '/request/requestId/comment/commentId': {
      patch: {
        tags: ['comment'],
        summary: 'Edit a posted comment',
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
                commentBody: {
                  type: 'string',
                  example: 'About my last comment, I meant to say nothing actually.'
                }
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'comment successfully updated',
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
          404: {
            description: 'comment with that comment ID and or user ID does not exist',
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
      delete: {
        tags: ['comment'],
        summary: 'delete a posted comment',
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
            description: 'comment successfully deleted',
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
            description: 'You are not the owner of the comment, invalid token',
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
    }
    ,
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
        },
      },
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
                },
                type: {
                  type: 'string',
                  example: 'xyz suite'
                },
                cost: {
                  type: 'string',
                  example: 'We offer a range of 300 to 700k'
                },
                totalNumberOfRooms: {
                  type: 'integer',
                  example: '10'
                },
                description: {
                  type: 'string',
                  example: 'Centiry house is a test accommodation...'
                },
                addOn: {
                  type: 'string',
                  example: 'Exclusive courtyard'
                },
                amenities: {
                  type: 'array',
                  example: ['Internet', 'Power']
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
            },
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
        },
      },
      get: {
        tags: ['accommodation & rooms'],
        summary: 'View all accommodation facilities',
        produces: ['application/json'],
        parameters: [
        {
          name: 'Authorization',
          in: 'headers',
          description: 'Bearer token',
          type: 'string'
        },
      ],
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
          }
        },
      },
    },
        '/accommodation/:accommodationId': {
          get: {
            tags: ['accommodation & rooms'],
            summary: 'View a specific accommodation facility',
            produces: ['application/json'],
            parameters: [
            {
              name: 'Authorization',
              in: 'headers',
              description: 'Bearer token',
              type: 'string'
            },
            {
              in: 'parameter',
              name: 'accommodationId',
              type: 'integer'
            },
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
          patch: {
            tags: ['accommodation & rooms'],
            summary: 'Updates the details of an accommodation facility',
            produces: ['application/json'],
            parameters: [
              {
                name: 'Authorization',
                in: 'headers',
                description: 'Bearer token',
                type: 'string'
              },
              {
                in: 'parameter',
                name: 'accommodationId',
                type: 'integer'
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
                    },
                    type: {
                      type: 'string',
                      example: 'xyz suite'
                    },
                    cost: {
                      type: 'string',
                      example: 'We offer a range of 300 to 700k'
                    },
                    totalNumberOfRooms: {
                      type: 'integer',
                      example: '10'
                    },
                    description: {
                      type: 'string',
                      example: 'Centiry house is a test accommodation...'
                    },
                    addOn: {
                      type: 'string',
                      example: 'Exclusive courtyard'
                    },
                    amenities: {
                      type: 'array',
                      example: ['Internet', 'Power']
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
                description: 'Accommodation has been successfully updated',
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
                },
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
            },
          },
          delete: {
            tags: ['accommodation & rooms'],
            summary: 'Deletes an accommodation facility',
            produces: ['application/json'],
            parameters: [
              {
                name: 'Authorization',
                in: 'headers',
                description: 'Bearer token',
                type: 'string'
              },
              {
                name: 'accommodationId',
                in: 'parameter',
                type: 'integer'
              },
            ],
            responses: {
              200: {
                description: 'Accommodation has been successfully deleted',
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
                },
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
            },
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
                name: 'accommodationId',
                in: 'parameter',
                type: 'integer'
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
          get: {
            tags: ['accommodation & rooms'],
            summary: 'View all rooms in an accommodation facility',
            produces: ['application/json'],
            parameters: [
              {
                name: 'Authorization',
                in: 'headers',
                description: 'Bearer token',
                type: 'string'
              },
              {
                in: 'parameter',
                type: 'integer',
                name: 'accommodationId',
              },
            ],
            responses: {
              200: {
                description: 'Response',
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
              404: {
                description: 'Accommodation not found',
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
    '/accommodation/:accommodationId/room/:roomId': {
      patch: {
        tags: ['accommodation & rooms'],
        summary: 'Updates the details of a specific room in an accommodation',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Bearer token',
            type: 'string'
          },
          {
            in: 'parameter',
            name: 'accommodationId',
            type: 'integer',
          },
          {
            in: 'parameter',
            name: 'roomId',
            type: 'integer',
          },
          {
            in: 'body',
            name: 'body',
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
                },
                cost: {
                  type: 'string',
                  example: 'Southern Bay'
                }
              }
            }
          },
        ],
        responses: {
          200: {
            description: 'Accommodation has been successfully updated',
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
      delete: {
        tags: ['accommodation & rooms'],
        summary: 'Deletes a specific room in an accommodation',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            description: 'Bearer token',
            type: 'string'
          },
          {
            in: 'parameter',
            name: 'accommodationId',
            type: 'integer',
          },
          {
            in: 'parameter',
            name: 'roomId',
            type: 'integer',
          },
        ],
        responses: {
          200: {
            description: 'Accommodation has been successfully deleted',
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
    '/accommodation/create': {
      post: {
        consumes: ['multipart/form-data'],
        produces: ['application/json'],
        summary: 'Creates an accommodation facility',
        parameters: [
          {
            name: 'type',
            type: 'string',
            in: 'body',
            description: 'Accommodation type'
          },
          {
            name: 'picture',
            type: 'file',
            in: 'form',
            description: 'Picture of facility if available'
          },
          {
            name: 'Authorization',
            type: 'string',
            in: 'headers',
            description: 'Bearer token'
          }
        ],
        responses: {
          201: {
            description: 'Successfully created facility',
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
      }
    },
    '/accommodation/book': {
      post: {
        produces: ['application/json'],
        summary: 'Books an accommodation facility',
        parameters: [
          {
            name: 'id',
            type: 'string',
            in: 'query',
            description: 'ID of accommodation to book'
          },
          {
            name: 'movingIn',
            type: 'date',
            in: 'body',
            description: 'Date user intends moving in'
          },
          {
            name: 'movingOut',
            type: 'date',
            in: 'body',
            description: 'Date user intends moving out'
          },
          {
            name: 'Authorization',
            type: 'string',
            in: 'headers',
            description: 'Bearer token'
          }
        ],
        responses: {
          200: {
            description: 'Successfully booked facility',
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
    '/accommodation/rescind': {
      post: {
        produces: ['application/json'],
        summary: 'Cancels booking of a facility',
        parameters: [
          {
            name: 'id',
            type: 'string',
            in: 'query',
            description: 'id'
          },
          {
            name: 'Authorization',
            type: 'string',
            in: 'headers',
            description: 'Bearer token'
          }
        ],
        responses: {
          200: {
            description: 'Successfully rescinded booking',
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
    '/rating': {
      post: {
        tags: [
          'rating'
        ],
        summary: 'Rate an accommodation',
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
                accommodationId: {
                  type: 'integer',
                  example: 1
                },
                rating: {
                  type: 'integer',
                  example: 4
                }
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation; rating was successful',
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
                    averageRating: {
                      type: 'integer',
                      example: 4
                    },
                    numberOfRatings: {
                      type: 'integer',
                      example: 3
                    },
                    accommodationId: {
                      type: 'integer',
                      example: 3
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
          },
          401: {
            description: 'Trying to rate an accommodation that a user has not booked',
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
    '/destination/most_travelled': {
      get: {
        produces: ['application/json'],
        summary: 'Gets the most travelled destination',
        parameters: [
          {
            name: 'Authorization',
            in: 'headers',
            type: 'string',
            description: 'Bearer token'
          }
        ],
        responses: {
          200: {
            description: 'Success',
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
                data: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    }
  // },
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
      TripValidationResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            example: 400,
          },
          error: {
            type: 'string',
            example: 'Invalid id supplied'
          },
        },
      },
    },
    EmailNotFoundResponse: {
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
    TripValidationResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 400,
        },
        error: {
          type: 'string',
          example: 'Invalid id supplied'
        },
      },
    },
    TripDeletedResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Trip successfully deleted'
        },
      },
    },
    RequestNotFoundResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 404,
        },
        error: {
          type: 'string',
          example: 'Invalid requset Id/ No trip with the stated id'
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
      RequestValidationResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          error: {
            type: 'array',
            example: ['Invalid date selected']
          },
        },
      },
    },
    RequestValidationResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 400,
        },
        error: {
          type: 'array',
          example: ['Invalid date selected']
        },
      },
    },
    CreateRequest: {
      type: 'object',
      properties: {
        passportName: {
          type: 'string',
          example: 'Iyara Ferguson'
        },
        reason: {
          type: 'string',
          example: 'Pilgrimage'
        },
        type: {
          type: 'string',
          example: 'round-trip'
        },
        from: {
          type: 'array',
          example: ['Dubai']
        },
        to: {
          type: 'array',
          example: ['Seychelles']
        },
        departureDate: {
          type: 'array',
          example: ['2018-03-29T13:34:00.000']
        },
        arrivalDate: {
          type: 'array',
          example: ['2018-03-29T13:34:00.000']
        },
        accommodation: {
          type: 'array',
          example: ['Four Points']
        },
      }
    },
    UpdateSuccessful: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 200,
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            passportName: {
              type: 'string',
              example: 'Iyara Ferguson',
            },
            reason: {
              type: 'string',
              example: 'Pilgrimage',
            },
            type: {
              type: 'string',
              example: 'one-way',
            },
            trips: {
              type: 'array',
              example: [
                {
                  from: 'Dubai',
                  to: 'Lagos',
                  departureDate: '2018-03-29T13:34:00.000',
                  arrivalDate: '2018-03-29T13:34:00.000',
                  accommodation: 'Four Points'
                }
              ],
            }
          },
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
    },
    UserRightsResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 403,
        },
        error: {
          type: 'string',
          example: 'You do not have rights to this resource'
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
};
