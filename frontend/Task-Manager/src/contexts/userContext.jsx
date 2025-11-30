import { createContext, useEffect, useState } from 'react';
import { API_PATHS } from '../utils/apiPath';
import axiosInstance from '../utils/axiosInstance';

// Contexto que expõe informações do usuário logado e utilitários de autenticação
export const UserContext = createContext();

/**
 * UserProvider
 * Responsável por:
 * - Carregar o perfil do usuário usando o token salvo (se existir)
 * - Expor estado de carregamento e helpers (updateUser / clearUser)
 * - Manter consistência do nome da chave do token: 'accessToken'
 */
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Dados do usuário autenticado
  const [loading, setLoading] = useState(true); // Flag de carregamento inicial

  useEffect(() => {
    let isMounted = true; // Flag para evitar setState após unmount

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // Sem token → não autenticado
      if (isMounted) setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        // Perfil carregado; alguns backends retornam { id, name, email, role }
        if (isMounted) setUser(response.data);
      } catch (error) {
        // Se 401, o interceptor pode já ter limpado o token/redirecionado
        console.error('Failed to fetch user profile', error);
        if (isMounted) clearUser();
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []); // Monta uma vez (token no localStorage é fonte de verdade)

  /**
   * Atualiza o usuário após login / atualização de perfil.
   * Se existir novo token, salva-o; nem todo endpoint retorna token.
   */
  const updateUser = (userData) => {
    if (!userData) return;
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('accessToken', userData.token);
    }
    setLoading(false);
  };

  /**
   * Limpa informações de usuário e token (logout local).
   */
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  const isAuthenticated = !!user; // Derivação simples de estado

  return (
    <UserContext.Provider value={{ user, loading, isAuthenticated, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
