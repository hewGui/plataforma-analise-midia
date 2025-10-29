import axios from "axios";

const api = axios.create({

    baseURL: 'http://localhost:3333/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Interceptor de Requisição (Vamos configurar isso mais tarde)
 * * Isso irá interceptar TODAS as requisições antes de serem enviadas
 * e anexar o token JWT (do localStorage) no header Authorization,
 * automatizando a autenticação em rotas protegidas.
 */
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;