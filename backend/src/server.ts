import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import mediaRoutes from './routes/media.routes'
import authMiddleware from './middlewares/auth.middleware';
import { AuthenticatedRequest } from './types';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;


//Middlewares (funções que rodam antes das rotas, servem por exemplo para verificar login, converter JSON,registrar log e etc)
app.use(cors());
app.use(express.json()); //Habilita o Express a receber JSON no body

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const databaseStatus = await prisma.user.count() >= 0
            ? "✅ Conectado e funcional"
            : "❌ Erro de conexão";

        res.json({
            status: 'API rodando',
            database_status: databaseStatus,
            message: `Bem vindo, usuário ID: ${req.userId}. Esta rota está protegida`,
            port: PORT,
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar o banco de dados.' });
    } 
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
})


