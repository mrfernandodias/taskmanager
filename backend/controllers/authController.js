const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Extrai do corpo da requisição os campos necessários para criar o usuário.
    // profileImageUrl e adminInviteToken são opcionais dependendo do seu fluxo.
    const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

    // Verifica se já existe um usuário cadastrado com este e-mail.
    // Se existir, retorna 400 (Bad Request) informando que o usuário já existe.
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Define a role do novo usuário.
    // Se foi enviado um token de convite de admin e ele confere com o do .env,
    // o novo usuário será 'admin'; caso contrário, assume 'member'.
    let role = 'member';
    if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
      role = 'admin';
    }

    // Gera um salt (valor aleatório) e cria o hash da senha informada.
    // Isso garante que a senha não seja armazenada em texto puro no banco.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria o documento do usuário no MongoDB com os dados informados.
    // Observação: a senha salva é a versão hasheada (hashedPassword).
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    // Retorna 201 (Created) com os dados essenciais do usuário criado
    // e um token JWT para autenticação nas próximas requisições.
    // Note que a senha não é enviada na resposta.
    res.status(201).json({
      _id: user.id, // 'id' é um getter do Mongoose que referencia 'user._id'
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id), // Gera um JWT contendo o _id do usuário
    });
  } catch (error) {
    // Caso ocorra algum erro inesperado no processo, retorna 500 (Server Error)
    // com a mensagem do erro para facilitar o debug.
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    // Extrai as credenciais do corpo da requisição
    const { email, password } = req.body;

    // Busca o usuário pelo e-mail no banco
    // Se não encontrar, retorna 401 sem revelar qual campo está errado
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compara a senha informada com o hash armazenado (bcrypt)
    // Retorna 401 se a senha não bater (mantendo a mesma mensagem por segurança)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Gera e retorna o token JWT, junto com dados essenciais do usuário
    // Observação: aqui o campo "name" está recebendo user.email (verifique se é intencional)
    res.json({
      _id: user.id, // id "stringificado" do Mongoose (alias de _id)
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id), // token assinado contendo o _id do usuário
    });
  } catch (error) {
    // Em caso de erro inesperado no servidor, retorna 500 com a mensagem
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user vem do middleware de autenticação (protect)
    // Lá o JWT foi verificado e o usuário foi carregado (ex.: req.user = { id: ..., role: ... })
    // Aqui usamos esse id para buscar o documento completo no banco

    const user = await User.findById(req.user.id).select('-password'); // Exclui o campo de senha do retorno por segurança

    // Se não encontrar o usuário (caso raro se o token era válido mas usuário foi deletado),
    // retorna 404 indicando que o recurso não existe.
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Retorna o documento do usuário (já sem password por causa do select acima).
    // Inclui _id, name, email, role, profileImageUrl, createdAt, updatedAt, __v (a menos que você o oculte).
    res.json(user);
  } catch (error) {
    // Se algo inesperado acontecer (erro de conexão, formato de id, etc.),
    // responde com 500 e a mensagem para ajudar no debug.
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    // Busca o usuário logado no banco usando o id que veio do middleware de autenticação (req.user.id)
    const user = await User.findById(req.user.id);

    // Se o usuário não existir (foi deletado após emitir o token, por exemplo), retorna 404
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Atualiza o nome se veio no body; se não veio, mantém o atual
    user.name = req.body.name || user.name;

    // Atualiza o e-mail se veio no body; se não veio, mantém o atual
    // (Não há validação de duplicidade aqui ainda, você vai tratar depois)
    user.email = req.body.email || user.email;

    // Se uma nova senha foi enviada, gera um salt e re-hasheia antes de salvar
    // (Você já corrigiu para usar req.body.password)
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Salva as alterações no documento (dispara validações do schema)
    const updateUser = await user.save();

    // Retorna os dados atualizados (sem a senha) e gera um novo token JWT
    // Obs: gerar token de novo pode ser útil se algo usado no payload mudar (ex.: email futuramente)
    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      role: updateUser.role,
      token: generateToken(updateUser._id),
    });
  } catch (error) {
    // Qualquer erro inesperado (ex.: falha de conexão, erro de validação não tratado) retorna 500
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
