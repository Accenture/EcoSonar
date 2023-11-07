const swaggerJSDoc = require('swagger-jsdoc')

const swagger = {
  swaggerDefinition: {
    info: {
      title: 'API EcoSonar',
      version: '3.2',
      description: 'Swagger UI of EcoSonar API'
    }
  },
  apis: ['routes/*.js']
}

const swaggerSpec = swaggerJSDoc(swagger)

module.exports = swaggerSpec
