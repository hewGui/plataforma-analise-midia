import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/auth.middleware";
import { AuthenticatedRequest, CreateMediaBody } from "../types";

const router = Router();
const prisma = new PrismaClient();

/**
 * Rota para Criar uma Nova Mídia
 * Método: POST
 * Endpoint: /api/media/
 * Proteção: authMiddleware (requer token JWT válido)
 */

router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    const authorId = req.userId;
    const { title, url, platform } = req.body as CreateMediaBody;

    if (!title || !url || !platform){
        return res.status(400).json({ message: 'Titulo, URL e Plataforma são obrigatórios'});
    }
    if (!authorId){
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try{
        const newMedia = await prisma.media.create({
            data: {
                title,
                url,
                platform,
                authorId,
            },
            select: {
                id: true,
                title: true,
                platform: true,
                url: true,
                createdAt: true,
                authorId: true,
            }
        });
        return res.status(201).json({
            message: 'Mídia registrada com sucesso!',
            media: newMedia
        });
    } catch (error){
        console.error('Erro ao registrar mídia: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao criar mídia'});
    }
});

/**
 * Rota para Buscar TODAS as Mídias do Usuário Logado
 * Método: GET
 * Endpoint: /api/media/
 * Proteção: authMiddleware (requer token JWT válido)
 */
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    
    const authorId = req.userId;
    if (!authorId){
        return res.status(401).json({ message: 'Usuário não autenticado.'});
    }

    try{
        const mediaList = await prisma.media.findMany({
            where: {
                authorId: authorId,
            },
            select: {
                id: true,
                title: true,
                platform: true,
                url: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(mediaList);
    }catch (error) {
        console.error('Erro ao buscar mídias: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar mídias.'});
    }
});

/**
 * Rota para Buscar uma Mídia Específica por ID
 * Método: GET
 * Endpoint: /api/media/:id
 * Proteção: authMiddleware (requer token JWT válido)
 */
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    const mediaId = req.params.id;
    const authorId = req.userId;
    
    if (!authorId){
        return res.status(401).json({ message: 'Usuário não autenticado'});
    }

    try{
        const media = await prisma.media.findUnique({
            where: {
                id: mediaId,
                authorId: authorId,
            },
            select: {
                id: true,
                title: true,
                platform: true,
                url: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!media){
            return res.status(404).json({ message: 'Mídia não encontrada ou acesso negado.'});
        }

        return res.status(200).json(media);
    } catch (error){
        console.error('Erro ao buscar mídia por ID: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor.'});
    }


})

/**
 * Rota para Atualizar uma Mídia Específica
 * Método: PUT
 * Endpoint: /api/media/:id
 * Proteção: authMiddleware + Autorização (deve pertencer ao usuário logado)
 */

router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {

    const mediaId = req.params.id;
    const authorId = req.userId;
    const { title, url, platform } = req.body as CreateMediaBody;

    if (!title || !url || !platform){
        return res.status(400).json({ message: 'Título, URL e Plataforma são obrigatórios para a atualização.'});
    }
    if (!authorId) {
        return res.status(401).json({ message: 'Usuário não autenticado.'});
    }

    try {
        const existingMedia = await prisma.media.findFirst({
            where: {
                id: mediaId,
                authorId: authorId,
            },
        });
        if (!existingMedia){
            return res.status(404).json({ message: 'Mídia não encontrada ou acesso negado.'});
        }

        const updateMedia = await prisma.media.update({
            where: {
                id: mediaId,
            },
            data: {
                title,
                url,
                platform,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                title: true,
                platform: true,
                url: true,
                updatedAt: true,
            }
        });

        return res.status(200).json({
            message: 'Mídia atualizada com sucesso',
            media: updateMedia
        });
    }catch(error){
        console.error('Erro ao atualizar mídia: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar mídia'});
    }
});
/**
 * Rota para Excluir uma Mídia Específica
 * Método: DELETE
 * Endpoint: /api/media/:id
 * Proteção: authMiddleware + Autorização (deve pertencer ao usuário logado)
 */ 
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    
    const mediaId = req.params.id;
    const authorId = req.userId;

    if (!authorId){
        return res.status(401).json({ message: 'Usuário não autenticado.'});
    }

    try {
        const result = await prisma.media.deleteMany({
            where: {
                id: mediaId,
                authorId: authorId,
            },
        });

        if (result.count === 0){
            return res.status(404).json({ message: 'Mídia não encontrada ou acesso negado.'});
        }

        return res.status(204).send();
    
    }catch (error) {
        console.error('Erro ao excluir mídia: ', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao excluir mídia.'});
    }
});


export default router;