
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { RegisterUserBody, LoginBody, JWTPayload } from "../types";
import { sign, SignOptions } from "jsonwebtoken";


const router = Router();
const prisma = new PrismaClient();

/**
 * Rota de Registro de Novo Usuário
 * Método: POST
 * Endpoint: /api/auth/register
 */

router.post('/register', async (req: Request<{}, {}, RegisterUserBody>, res: Response) => {

    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
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

    } catch (error) {
        console.error('Erro ao registrar usuário: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' })
    }

});

/**
 * Rota de Login de Usuário e gerar JSON Web Token (JWT)
 * Método: POST
 * Endpoint: /api/auth/login
 */

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch){
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const payload: JWTPayload = { id: user.id };

        if (!process.env.JWT_SECRET){
            throw new Error("JWT_SECRET não está definido no ambiente.");
        }

        const token = sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            } as SignOptions
        );

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    
    }catch (error){
        console.error('Erro no login: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor.'})
    }
});


export default router;
