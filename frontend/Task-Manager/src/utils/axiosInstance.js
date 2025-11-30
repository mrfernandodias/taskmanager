import axios from 'axios';
import { BASE_URL } from './apiPath';

/**
 * Instância customizada do Axios para todas as requisições à API
 * Configurações globais:
 * - baseURL: URL base do backend (importada de apiPath.js)
 * - timeout: 10 segundos por requisição
 * - headers padrão: JSON (Content-Type e Accept)
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * Executa antes de cada requisição sair para o servidor.
 * Injeta automaticamente o token JWT no header Authorization se existir no localStorage.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Busca o token de autenticação no localStorage
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Adiciona token no formato Bearer (padrão JWT)
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config; // Prossegue com a requisição
  },
  (error) => {
    // Erro ao configurar a requisição (raro)
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Executa após cada resposta do servidor.
 * Trata erros HTTP globais (401, 500, timeout) e de rede.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Resposta bem-sucedida (2xx): retorna normalmente
    return response;
  },
  (error) => {
    // Trata erros comuns de forma centralizada
    if (error.response) {
      // Servidor respondeu com status de erro (4xx, 5xx)
      if (error.response.status === 401) {
        // 401 Unauthorized: verificar se NÃO é tentativa de login/registro
        const isAuthRequest =
          error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');

        // Se não for auth, é token expirado → logout
        if (!isAuthRequest) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        // Se for auth (login/registro com credenciais erradas), apenas repassa o erro
      } else if (error.response.status === 500) {
        // 500 Internal Server Error: erro no backend
        console.error('Server error. Please try again later');
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout: requisição excedeu 10 segundos
      console.error('Request timeout. Please try again');
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta (problema de rede)
      console.error('Network error. Check your connection');
    } else {
      // Erro ao configurar a requisição (raro)
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error); // Repassa erro para o caller tratar
  }
);

export default axiosInstance;
