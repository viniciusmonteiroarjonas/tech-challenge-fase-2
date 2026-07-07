const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plataforma de Blogging Educacional',
      version: '1.0.0',
      description:
        'API RESTful para gerenciamento de posts de uma plataforma de blogging voltada a professores e alunos da rede pública de educação.',
      contact: {
        name: 'Tech Challenge - Fase 2',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    tags: [
      {
        name: 'Posts',
        description: 'Operações de CRUD e busca de postagens',
      },
    ],
    components: {
      schemas: {
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '6688c1234abc1234abc12345',
              readOnly: true,
            },
            titulo: {
              type: 'string',
              example: 'Introdução ao Node.js',
            },
            conteudo: {
              type: 'string',
              example: 'Node.js é um ambiente de execução JavaScript do lado do servidor...',
            },
            autor: {
              type: 'string',
              example: 'Prof. Ana Souza',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
            },
          },
        },
        PostInput: {
          type: 'object',
          required: ['titulo', 'conteudo', 'autor'],
          properties: {
            titulo: {
              type: 'string',
              example: 'Introdução ao Node.js',
            },
            conteudo: {
              type: 'string',
              example: 'Node.js é um ambiente de execução JavaScript do lado do servidor...',
            },
            autor: {
              type: 'string',
              example: 'Prof. Ana Souza',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Post não encontrado',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
