const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users/
// @access  Private (admin)
const getUsers = async (req, res) => {
  try {
    // 1) Busca todos os usuários com role 'member' e remove o campo password do retorno
    //    - User.find(...) retorna uma Promise
    //    - usamos await porque precisamos dos usuários para o próximo passo
    const users = await User.find({ role: 'member' }).select('-password');

    // 2) Para cada usuário, calcular contagens de tarefas por status.
    //    - users.map(async (user) => { ... }) cria uma função async que "captura" (closure) o 'user' do escopo externo
    //    - o map retorna um array de Promises (uma por usuário)
    //    - Promise.all aguarda TODAS essas Promises terminarem em paralelo
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        // 2.1) Para este usuário, faz 3 contagens (uma após a outra, sequencialmente):
        //      - cada Task.countDocuments retorna uma Promise
        // Observação: aqui está sequencial. Se quisesse paralelizar entre os 3 status,
        // daria para usar Promise.all([countPending, countInProgress, countCompleted]).
        const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'In Progress',
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'Completed',
        });

        // 2.2) Monta o objeto de resposta combinando os dados do usuário
        //      com as contagens calculadas
        //      - user._doc é o objeto "puro" do documento Mongoose
        return {
          ...user._doc, // inclui todos os campos do usuário já sem 'password'
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    // 3) Envia a resposta quando TODAS as promessas do Promise.all terminarem
    //    - ou seja, só responde quando a lista inteira já estiver enriquecida com as contagens
    res.json(usersWithTaskCounts);
  } catch (error) {
    // 4) Qualquer erro (na busca dos usuários ou nas contagens) é capturado aqui
    //    - retorna status 500 com a mensagem do erro
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, getUserById };
