import { Response, NextFunction } from "express"; 
import { verify, Secret } from "jsonwebtoken";
import { AuthenticatedRequest, JWTPayload } from "../types";

/**
 * Middleware de Autenticação
 * 1. Verifica a existência e formato do token no header 'Authorization'.
 * 2. Verifica a validade do JWT (assinatura, expiração).
 * 3. Se válido, anexa o userId à requisição (req.userId).
 */

const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')){

        return res.status(401).json({ message: 'Token de autenticação ausente ou inválido.'});
    }

    const token = authHeader.split(' ')[1];

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret){
        return res.status(500).json({ message: 'Erro de configuração do servidor. Chave JWT ausente.'});
    }

    try {

        const decoded = verify(token, jwtSecret as Secret) as JWTPayload;

        req.userId = decoded.id;

        next();
    }catch (error) {

        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export default authMiddleware;