import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from "../types";

const router = Router();
const prisma = new PrismaClient();

/**
 * Rota Protegida de Teste para Mídia
 * Método: POST
 * Endpoint: /api/media/
 * Objetivo: Simular a criação de uma nova mídia.
 */

router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.userId;

    try{
        return res.status(201).json({
            message: 'Mídia criada com sucesso (Simulado)!',
            userId: userId,
            endpoint: "/api/media"
        });
    }catch (error) {
        console.error('Erro ao processar mídia: ', error);
        return res.status(500).json({ message: 'Erro interno ao criar mídia' });
    }
});

export default router;