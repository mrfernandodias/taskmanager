import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import AuthLayout from '../../components/layouts/AuthLayout';
import { UserContext } from '../../contexts/userContext';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail, validateFullName } from '../../utils/helper';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  // Estados controlados do formulário
  const [profilePic, setProfilePic] = useState(null); // File da foto (opcional)
  const [fullName, setFullName] = useState(''); // Nome completo do usuário
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Senha
  const [adminInviteToken, setAdminInviteToken] = useState(''); // Token especial (admin)

  const [error, setError] = useState(null); // Mensagem de erro exibida na UI

  // Funções de contexto (updateUser atualiza estado global após cadastro)
  const { updateUser } = useContext(UserContext);
  // Navegação imperativa pós-sucesso
  const navigate = useNavigate();

  /**
   * handleSignUp
   * Fluxo:
   * - Previne submit padrão
   * - Valida campos (nome, email, senha)
   * - Faz upload da imagem se existir
   * - Chama API de registro
   * - Salva token, atualiza contexto e redireciona conforme role
   * - Trata erros da API exibindo mensagem apropriada
   */
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = ''; // Será preenchido se houver upload

    // Validação de nome (usa helper)
    if (!validateFullName(fullName)) {
      setError('Please enterfull name'); // (typo: “enterfull” poderia ser “enter full”)
      return;
    }

    // Validação de email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validação de senha simples (não vazia)
    if (!password) {
      setError('Please enter the password');
      return;
    }

    // Limpa erro anterior
    setError('');

    try {
      // Upload da imagem antes do cadastro (se usuário escolheu)
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        // Assume retorno com campo imageUrl
        profileImageUrl = imageUploadRes.imageUrl || '';
      }

      // Chamada à rota de registro
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        adminInviteToken,
        profileImageUrl,
      });

      // Extrai token e role para fluxo pós-cadastro
      const { token, role } = response.data;

      if (token) {
        // Persistência do token (coerente com axiosInstance que lê accessToken)
        localStorage.setItem('accessToken', token);
        // Atualiza contexto global com dados completos retornados
        updateUser(response.data);

        // Redireciona condicionalmente conforme papel (admin/user)
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      // Exibe mensagem específica do backend se existir
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        // Mensagem fallback genérica (typo: “againd” → “again”)
        setError('Something went wrong. Please try againd');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        {/* Form controlado; submit dispara handleSignUp */}
        <form onSubmit={handleSignUp}>
          {/* Seletor / preview de foto de perfil */}
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome completo */}
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Enter full name"
              placeholder="John Doe"
              type="text"
            />

            {/* Email */}
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Adress"
              placeholder="john@example.com"
              type="text"
            />

            {/* Senha */}
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />

            {/* Token de convite admin (6 dígitos) */}
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 digit characters"
              type="text"
              maxLength={6} // Limita digitação a 6 caracteres
              inputMode="numeric" // Força teclado numérico em mobile
              pattern="\\d{6}" // Validação HTML: exatamente 6 dígitos
            />
          </div>

          {/* Mensagem de erro (se existir) */}
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          {/* Botão de submit */}
          <button className="btn-primary uppercase" type="submit">
            Sign Up
          </button>

          {/* Link para página de login */}
          <p className="text-[13px] text-slate-800 mt-3">
            Already an account?{' '}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
