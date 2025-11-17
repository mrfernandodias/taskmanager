const Task = require('../models/Task');

// @desc    Get all tasks (Admin: all, User: only assigned tasks)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // 1) Ler filtros de query (ex.: ?status=Pending)
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status; // se veio status, filtra por ele
    }

    // 2) Montar a consulta base conforme o papel do usuário
    //    - admin: vê todas as tasks
    //    - user: vê apenas tasks atribuídas a ele
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find(filter)
        // 3) populate: traz dados dos usuários referenciados em assignedTo (name, email, profileImageUrl)
        .populate('assignedTo', 'name email profileImageUrl')
        // 4) lean: retorna objetos JS "puros" (mais leves) em vez de documentos Mongoose
        .lean();
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id })
        .populate('assignedTo', 'name email profileImageUrl')
        .lean();
    }

    // 5) Campo derivado: completedTodoCount
    //    Calcula quantos itens do checklist estão concluídos para cada task
    tasks = tasks.map((task) => {
      const completedCount = (task.todoChecklist || []).filter((item) => item.completed).length;
      return { ...task, completedTodoCount: completedCount };
    });

    // 6) Resumo por status
    //    Faz 4 contagens: total (respeitando filtros/escopo), Pending, In Progress e Completed
    const allTasks = await Task.countDocuments({
      ...(req.user.role !== 'admin' && { assignedTo: req.user._id }), // restringe ao usuário comum
      ...filter, // aplica o mesmo filtro de status (se houver)
    });

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: 'Pending',
      ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: 'In Progress',
      ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: 'Completed',
      ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
    });

    // 7) Resposta final: lista de tasks + resumo por status
    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    // 8) Tratamento de erros: erro genérico do servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get tak by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      'assignedTo',
      'name email profileImageUrl'
    );

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new Task (Admin only)
// @route   POST /api/tasks/
// @access  Private (Admin)
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } =
      req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({ message: 'assignedTo must be an array of user IDs' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      attachments,
    });

    res.status(201).json({ message: 'Task created successfuly', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({ message: 'assignedTo must be an array of user IDs' });
      }

      task.assignedTo = req.body.assignedTo;
    }

    const updateTask = await task.save();
    res.json({ message: 'Task updated successfully', updateTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); // precisa do await
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne(); // também precisa do await
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.status = req.body.status || task.status;

    if (task.status === 'Completed') {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {
  try {
    // 1) Extrair o novo checklist do body da requisição
    const { todoChecklist } = req.body;

    // 2) Buscar a task pelo ID da URL
    const task = await Task.findById(req.params.id);

    // 3) Verificar se a task existe
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // 4) Autorização: verificar se o usuário está na lista assignedTo OU se é admin
    //    includes() verifica se o _id do usuário logado está no array assignedTo
    if (!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update checklist' });
    }

    // 5) Substituir o checklist antigo pelo novo (recebido do frontend)
    task.todoChecklist = todoChecklist;

    // 6) Calcular progresso automaticamente baseado no checklist
    //    - Conta quantos itens têm completed = true
    const completedCount = task.todoChecklist.filter((item) => item.completed).length;
    //    - Total de itens no checklist
    const totalItems = task.todoChecklist.length;
    //    - Calcula percentual de conclusão (arredondado)
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // 7) Auto-atualizar o status da task baseado no progresso
    //    - 100%: marca como Completed
    if (task.progress === 100) {
      task.status = 'Completed';
      //    - Entre 1% e 99%: marca como In Progress
    } else if (task.progress > 0) {
      task.status = 'In Progress';
      //    - 0%: marca como Pending
    } else {
      task.status = 'Pending';
    }

    // 8) Salvar as mudanças no banco (todoChecklist, progress, status)
    await task.save();

    // 9) Buscar a task atualizada com populate para retornar dados completos dos usuários
    //    (para o frontend ter name, email, profileImageUrl dos assignedTo)
    const updatedTask = await Task.findById(req.params.id).populate(
      'assignedTo',
      'name email profileImageUrl'
    );

    // 10) Responder com a task completa e atualizada
    res.json({ message: 'Task checklist updated', task: updatedTask });
  } catch (error) {
    // 11) Tratamento de erros: erro genérico do servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Dashboard Data (Admin only)
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // ========== SEÇÃO 1: ESTATÍSTICAS BÁSICAS ==========

    // 1) Contar total de tasks no sistema
    const totalTasks = await Task.countDocuments();

    // 2) Contar tasks com status Pending
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });

    // 3) Contar tasks com status Completed
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    // 4) Contar tasks atrasadas (overdue):
    //    - Status diferente de 'Completed' ($ne = not equal)
    //    - dueDate menor que a data atual ($lt = less than)
    const overdueTasks = await Task.countDocuments({
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() },
    });

    // ========== SEÇÃO 2: DISTRIBUIÇÃO POR STATUS ==========

    // 5) Definir todos os status possíveis para garantir que apareçam no gráfico
    //    mesmo quando a contagem for zero
    const taskStatuses = ['Pending', 'In Progress', 'Completed'];

    // 6) Usar aggregation para agrupar tasks por status e contar
    //    $group: agrupa documentos por um campo (_id: '$status')
    //    $sum: 1 conta quantos documentos existem em cada grupo
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: '$status', // agrupa pelo campo 'status'
          count: { $sum: 1 }, // conta documentos em cada grupo
        },
      },
    ]);

    // 7) Transformar o resultado do aggregate em um objeto mais amigável
    //    - Garante que todos os status apareçam (mesmo com count = 0)
    //    - Remove espaços do nome do status para usar como chave (ex: "In Progress" → "InProgress")
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ''); // remove espaços
      // Busca o count do aggregate, ou usa 0 se não encontrou
      acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    // 8) Adicionar contagem total no mesmo objeto
    taskDistribution['All'] = totalTasks;

    // ========== SEÇÃO 3: DISTRIBUIÇÃO POR PRIORIDADE ==========

    // 9) Definir todos os níveis de prioridade possíveis
    const taskPriorities = ['Low', 'Medium', 'High'];

    // 10) Usar aggregation para agrupar tasks por prioridade
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: '$priority', // agrupa pelo campo 'priority'
          count: { $sum: 1 }, // conta documentos em cada grupo
        },
      },
    ]);

    // 11) Transformar resultado em objeto, garantindo todas as prioridades apareçam
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      // Busca o count do aggregate, ou usa 0 se não encontrou
      acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // ========== SEÇÃO 4: TASKS RECENTES ==========

    // 12) Buscar as 10 tasks mais recentes
    //     - sort({ createdAt: -1 }): ordena por data de criação, decrescente (mais recentes primeiro)
    //     - limit(10): pega apenas 10 resultados
    //     - select(): projeta apenas os campos necessários (economia de dados)
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status priority dueDate createdAt');

    // ========== RESPOSTA FINAL ==========

    // 13) Montar objeto de resposta estruturado em seções
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution, // objeto com contagens por status
        taskPriorityLevels, // objeto com contagens por prioridade
      },
      recentTasks, // array com as 10 tasks mais recentes
    });
  } catch (error) {
    // 14) Tratamento de erros: erro genérico do servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Dashboard Data (User-specific)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
  try {
    // 1) Pegar o ID do usuário logado (vem do middleware de autenticação)
    const userId = req.user._id;

    // ========== SEÇÃO 1: ESTATÍSTICAS BÁSICAS (SOMENTE TASKS DO USUÁRIO) ==========

    // 2) Contar total de tasks atribuídas ao usuário
    const totalTasks = await Task.countDocuments({ assignedTo: userId });

    // 3) Contar tasks Pending do usuário
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });

    // 4) Contar tasks Completed do usuário
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'Completed' });

    // 5) Contar tasks atrasadas do usuário (não completadas e com dueDate no passado)
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() },
    });

    // ========== SEÇÃO 2: DISTRIBUIÇÃO POR STATUS (SOMENTE TASKS DO USUÁRIO) ==========

    // 6) Definir todos os status possíveis
    const taskStatuses = ['Pending', 'In Progress', 'Completed'];

    // 7) Usar aggregation para contar tasks por status
    //    $match: filtra apenas tasks do usuário (assignedTo contém userId)
    //    $group: agrupa por status e conta
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } }, // filtra pelo usuário
      { $group: { _id: '$status', count: { $sum: 1 } } }, // agrupa e conta
    ]);

    // 8) Transformar em objeto com todos os status (mesmo os zerados)
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ''); // remove espaços
      acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    // 9) Adicionar contagem total
    taskDistribution['All'] = totalTasks;

    // ========== SEÇÃO 3: DISTRIBUIÇÃO POR PRIORIDADE (SOMENTE TASKS DO USUÁRIO) ==========

    // 10) Definir todos os níveis de prioridade possíveis
    const taskPriorities = ['Low', 'Medium', 'High'];

    // 11) Usar aggregation para contar tasks por prioridade
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } }, // filtra pelo usuário
      { $group: { _id: '$priority', count: { $sum: 1 } } }, // agrupa e conta
    ]);

    // 12) Transformar em objeto com todas as prioridades (mesmo as zeradas)
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc; // retorna o acumulador
    }, {}); // objeto vazio como valor inicial

    // ========== SEÇÃO 4: TASKS RECENTES DO USUÁRIO ==========

    // 13) Buscar as 10 tasks mais recentes do usuário
    //     - find({ assignedTo: userId }): filtra apenas tasks do usuário
    //     - sort({ createdAt: -1 }): ordena por data de criação, decrescente (mais recentes primeiro)
    //     - limit(10): pega apenas 10 resultados
    //     - select(): projeta apenas os campos necessários (economia de dados)
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status priority dueDate createdAt');

    // ========== RESPOSTA FINAL ==========

    // 14) Retornar dados estruturados do dashboard do usuário
    return res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution, // objeto com contagens por status
        taskPriorityLevels, // objeto com contagens por prioridade
      },
      recentTasks, // array com as 10 tasks mais recentes
    });
  } catch (error) {
    // 15) Tratamento de erros: erro genérico do servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
