import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJSDoc.Options = {

    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Plataforma de Análise de Midia API',
            version: '1.0.0',
            description: 'API Full-Stack para gerenciar e analisar mídias (Filmes/Vídeos). Possui autenticação JWT e CRUD protegido',
        },
        servers: [
            {
                url: 'http://localhost:3333/api',
                description: 'Servidor de Desenvolvimento Local',
            },
            // Você pode adicionar um servidor de produção aqui mais tarde.
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT (Ex: Bearer <seu_token>'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        path.join(__dirname, 'routes', '*.ts'),
        path.join(__dirname, 'types', '*.ts'),
        path.join(__dirname, '..', 'docs', '*.yaml')
    ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;