const excelJS = require('exceljs');

const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Export all tasks as an Excel file
// @route   GET /api/reports/exports/tasks
// @access  Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
    // 1) Buscar todas as tasks do sistema com populate dos usuários atribuídos
    //    populate('assignedTo', 'name email'): traz apenas name e email dos usuários
    const tasks = await Task.find().populate('assignedTo', 'name email');

    // 2) Criar um novo workbook (arquivo Excel)
    const workbook = new excelJS.Workbook();

    // 3) Adicionar uma worksheet (planilha/aba) chamada 'Tasks Report'
    const worksheet = workbook.addWorksheet('Tasks Report');

    // 4) Definir as colunas da planilha
    //    header: nome da coluna que aparece na primeira linha
    //    key: campo do objeto que será mapeado para esta coluna
    //    width: largura da coluna em caracteres
    worksheet.columns = [
      { header: 'Task ID', key: '_id', width: 25 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Due Date', key: 'dueDate', width: 20 },
      { header: 'Assigned To', key: 'assignedTo', width: 30 },
    ];

    // 5) Iterar sobre todas as tasks e adicionar cada uma como uma linha na planilha
    tasks.forEach((task) => {
      // 6) Formatar campo assignedTo: concatenar nome e email de todos os usuários
      //    Exemplo: "João Silva (joao@email.com), Maria Santos (maria@email.com)"
      const assignedTo = task.assignedTo.map((user) => `${user.name} (${user.email})`).join(', ');

      // 7) Adicionar linha na planilha com os dados da task
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        // 8) Formatar dueDate para YYYY-MM-DD (remove hora)
        dueDate: task.dueDate.toISOString().split('T')[0],
        assignedTo: assignedTo || 'Unassigned', // fallback se não houver usuários
      });
    });

    // 9) Configurar headers HTTP para download do arquivo Excel
    //    Content-Type: indica que é um arquivo Excel (formato Office Open XML)
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    //    Content-Disposition: indica que é um download (attachment) e define o nome do arquivo
    res.setHeader('Content-Disposition', 'attachment; filename="tasks_report.xlsx"');

    // 10) Escrever o workbook diretamente no stream de resposta (res)
    //     write() retorna uma Promise, então aguardamos e depois finalizamos a resposta
    return workbook.xlsx.write(res).then(() => {
      res.end(); // finaliza o stream de resposta
    });
  } catch (error) {
    // 11) Tratamento de erros: retorna JSON com mensagem de erro
    res.status(500).json({
      message: 'Error exporting tasks',
      error: error.message,
    });
  }
};

// @desc    Export user-task report as an Excel file
// @route   GET /api/reports/exports/users
// @access  Private (Admin)
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select('name email _id').lean();
    const userTasks = await Task.find().populate('assignedTo', 'name email _id');

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === 'Pending') {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === 'In Progress') {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === 'Completed') {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error to export users',
      error: error.message,
    });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};
