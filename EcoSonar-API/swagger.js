import swaggerJSDoc from 'swagger-jsdoc'

const swagger = {
  swaggerDefinition: {
    info: {
      title: 'API EcoSonar',
      version: '3.8',
      description: 'Swagger UI of EcoSonar API'
    }
  },
  apis: ['routes/*.js']
}

const swaggerSpec = swaggerJSDoc(swagger)
export default swaggerSpec
