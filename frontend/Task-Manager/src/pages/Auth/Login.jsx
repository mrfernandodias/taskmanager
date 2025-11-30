import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Importa useNavigate
import Input from '../../components/Inputs/Input';
import AuthLayout from '../../components/layouts/AuthLayout';
import { UserContext } from '../../contexts/userContext';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail } from '../../utils/helper';

const Login = () => {
  // Estados do formulário
  const [email, setEmail] = useState('mrfernandodias@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  // Hook de navegação do React Router
  const navigate = useNavigate();

  /**
   * Lida com o submit do formulário de login
   * Valida campos, chama API e redireciona baseado no role
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne reload da página

    // Validação: email válido
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validação: senha não vazia
    if (!password) {
      setError('Please enter the password'); // ✅ Corrigido typo
      return;
    }

    setError(''); // Limpa erros anteriores

    // Chama API de login
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      // Extrai token e role da resposta
      const { token, role } = response.data;

      if (token) {
        // ✅ Salva com nome 'accessToken' (mesmo nome usado no axiosInstance)
        localStorage.setItem('accessToken', token);
        updateUser(response.data);

        // Redireciona baseado no papel do usuário
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      // Trata erros da API (401, 500, rede, etc.)
      if (error.response && error.response.data && error.response.data.message) {
        // ✅ Exibe mensagem de erro do backend
        setError(error.response.data.message);
      } else {
        // Erro genérico (timeout, rede)
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Please enter your details to login</p>

        <form onSubmit={handleLogin}>
          {/* Input de email */}
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Adress"
            placeholder="john@example.com"
            type="text"
          />

          {/* Input de senha com toggle de visibilidade */}
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {/* Mensagem de erro */}
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          {/* Botão de submit */}
          <button className="btn-primary uppercase" type="submit">
            Login
          </button>

          {/* Link para cadastro */}
          <p className="text-[13px] text-slate-800 mt-3">
            Dont't have an account?{' '}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
