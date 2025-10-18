 
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { RegisterUserBody } from "../types";

const router = Router();
const prisma = new PrismaClient();

/**
 * Rota de Registro de Novo Usuário
 * Método: POST
 * Endpoint: /api/auth/register
 */

router.post('/register', async (req: Request<{}, {}, RegisterUserBody>, res: Response) => {

    const { name, email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try{
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
    
    if (existingUser){
        return res.status(409).json({ message: 'Este e-mail já está em uso' });
    }
    
    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }
    });

    return res.status(201).json({
        message: 'Usuario registrado com sucesso!',
        user: newUser
    });

    }catch (error) {
        console.error('Erro ao registrar usuário: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' })
    }

});

export default router;
