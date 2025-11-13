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
      task.todoChecklist.forE;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {
  try {
    // TODO: implement updateTaskChecklist
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Dashboard Data (Admin only)
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // TODO: implement getDashboardData
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Dashboard Data (User-specific)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
  try {
    // TODO: implement getUserDashboardData
  } catch (error) {
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
