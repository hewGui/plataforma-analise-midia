import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../services/api';

const Register: React.FC = () => {
  
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //impede o recarregamento padrão da pagina
        setMessage('');
        setIsLoading(true);

        try {
            // 3. Envio dos dados para o backend
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
            });

            setMessage('✅ Registro realizado com sucesso! Redirecionando para o login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error: any) {
            let errorMessage = 'Falha no registro. Tente novamente.';

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            setMessage(`❌ Erro: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Criar Nova Conta</h2>

            {/*Exibe mensagens de feedback*/}
            {message && <p style={{ color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nome:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>

            <p>Já tem uma conta? <Link to="/login">Faça Login</Link></p>
        </div>
    );
}

export default Register;