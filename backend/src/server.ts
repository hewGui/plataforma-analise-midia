import express, {Request, Response} from 'express';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;
const app = express();


//Middlewares (funções que rodam antes das rotas, servem por exemplo para verificar login, converter JSON,registrar log e etc)
app.use(express.json()); //Habilita o Express a receber JSON no body

app.get('/', async (req: Request, res: Response) => {
    try{
        const userCount = await prisma.user.count();

        res.status(200).json({
            message: 'API rodando! Pronta para o desenvolvimento.',
            database_status: '✅ Conectado e funcional',
            userCount: userCount
        });
    }catch(error){
        console.log("Erro ao conectar ao banco de dados: ", error);
        res.status(500).json({
            message: "API rodando, MAS HOUVE ERRO na conexão com o Banco de Dados.",
            error: error instanceof Error ? error.message : "Erro desconhecido"
        });
    } finally{
        
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
})


