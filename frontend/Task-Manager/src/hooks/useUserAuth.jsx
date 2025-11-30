import { useContext, useEffect } from 'react';
// Hook do React Router para navegação imperativa (redirecionar programaticamente)
import { useNavigate } from 'react-router-dom';
// Contexto da aplicação com dados do usuário e helpers
import { UserContext } from '../contexts/userContext';

/**
 * useUserAuth
 * Hook de proteção de rotas: se NÃO houver usuário autenticado
 * (após o carregamento inicial), limpa estado/token e redireciona para /login.
 *
 * Uso típico: chamar dentro de páginas privadas.
 */
export const useUserAuth = () => {
  // Lê do contexto: usuário atual, flag de carregamento e helper para limpar auth
  const { user, loading, clearUser } = useContext(UserContext);
  // Navegador imperativo para redirecionar
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Ainda carregando (ex.: checando token/profile)? Não faz nada.
    if (loading) return;

    // 2) Já há usuário autenticado? Permite acesso, não redireciona.
    if (user) return;

    // 3) Carregamento concluído e NÃO há usuário:
    //    - limpa qualquer resíduo (estado/token)
    //    - redireciona para login
    clearUser();
    navigate('/login');
  }, [user, loading, clearUser, navigate]);
};
