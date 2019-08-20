const swagger = {
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
  produces: ['application/json'],
  paths: {
    '/auth/logout': {
      'post': {
        description: 'Logs user out of application',
        parameters: [
          {
            name: 'Authorization',
            in: 'header',
            description: 'Auth token',
            type: 'string'
          }
        ]
      }
    }
  }
};

export default swagger;
