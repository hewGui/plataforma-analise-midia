import { Router, Request, Response } from 'express';
import axios, { AxiosInstance } from 'axios';
import authMiddleware from '../middlewares/auth.middleware';
import { release } from 'os';


const router = Router();

let tmdbApi: AxiosInstance;

if (process.env.TMDB_BASE_URL && process.env.TMDB_API_KEY){
    tmdbApi = axios.create({
        baseURL: process.env.TMDB_BASE_URL,
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: 'pt-BR'
        }
    });
}else {
    throw new Error ("As variáveis TMDB_BASE_URL e TMDB_API_KEY devem estar definidas no .env");
}

/**
 * Rota de Busca de Mídia Externa (TMDB)
 * Método: GET
 * Endpoint: /api/external/search?query=nome_do_filme
 * Proteção: authMiddleware (apenas usuários logados podem buscar)
 */
router.get('/search', authMiddleware, async (req: Request, res: Response) => {
    
    const query = req.query.query as string

    if(!query){
        return res.status(400).json({ message: 'O parâmetro "query" é obrigatório'});
    }

    try {
        const response = await tmdbApi.get('/search/multi', {
            params: {
                query: query,
            }
        });

        const results = response.data.results.map((item: any) => ({
            tmdb_id: item.id,
            media_type: item.media_type,
            title: item.media_type === 'movie' ? item.title : item.name,
            release_date: item.release_date || item.first_air_date,
            poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        }));

        return res.status(200).json(results);
    } catch (error) {
        console.error('Erro ao buscar mídia externa:', error);
        return res.status(503).json({ message: 'Falha ao buscar dados na API externa (TMDB).'});
    }
});

export default router;