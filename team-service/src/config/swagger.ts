import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Team API',
    version: '1.0.0',
    description: 'API documentation for team microservice'
  },
  servers: [
    {
      url: process.env.API_PORT || 5555,
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['../src/routes/*.ts', '../src/models/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
