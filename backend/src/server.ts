import express, {Request, Response} from 'express';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT || 3000;


//Middlewares (funções que rodam antes das rotas, servem por exemplo para verificar login, converter JSON,registrar log e etc)
app.use(express.json());

app.get('/', (req: Request, res: Response) => {

    res.status(200).json({
        message: 'API Rodando! Pronta para o desenvolvimento.',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
})


