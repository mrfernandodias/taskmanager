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
    // 1) Buscar todos os usuários do sistema
    //    select('name email _id'): traz apenas os campos necessários
    //    lean(): retorna objetos JS puros (sem métodos Mongoose), mais leves
    const users = await User.find().select('name email _id').lean();

    // 2) Buscar todas as tasks com populate dos usuários atribuídos
    //    populate traz name, email e _id de cada usuário em assignedTo
    const userTasks = await Task.find().populate('assignedTo', 'name email _id');

    // 3) Criar mapa (objeto) para agregar dados de cada usuário
    //    Chave: _id do usuário | Valor: objeto com contadores de tarefas
    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0, // total de tarefas atribuídas
        pendingTasks: 0, // tarefas Pending
        inProgressTasks: 0, // tarefas In Progress
        completedTasks: 0, // tarefas Completed
      };
    });

    // 4) Iterar sobre todas as tasks para contar por status e usuário
    //    Uma task pode ter múltiplos usuários em assignedTo (array)
    userTasks.forEach((task) => {
      if (task.assignedTo) {
        // 5) Para cada usuário atribuído nesta task
        task.assignedTo.forEach((assignedUser) => {
          // 6) Verificar se o usuário existe no mapa (proteção contra dados órfãos)
          if (userTaskMap[assignedUser._id]) {
            // 7) Incrementar contador total
            userTaskMap[assignedUser._id].taskCount += 1;

            // 8) Incrementar contador específico por status
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

    // 9) Criar workbook (arquivo Excel)
    const workbook = new excelJS.Workbook();

    // 10) Adicionar worksheet (aba/planilha)
    const worksheet = workbook.addWorksheet('User Task Report');

    // 11) Definir colunas da planilha
    //     header: nome da coluna visível
    //     key: campo do objeto que será mapeado
    //     width: largura da coluna em caracteres
    worksheet.columns = [
      { header: 'User Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Total Assigned Tasks', key: 'taskCount', width: 20 },
      { header: 'Pending Tasks', key: 'pendingTasks', width: 20 },
      { header: 'In Progress Tasks', key: 'inProgressTasks', width: 20 },
      { header: 'Completed Tasks', key: 'completedTasks', width: 20 },
    ];

    // 12) Adicionar linhas: converte o mapa (objeto) em array de valores e itera
    //     Object.values() extrai apenas os valores, ignorando as chaves (_id)
    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    // 13) Configurar headers HTTP para download
    //     Content-Type: especifica formato Excel (Office Open XML)
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    //     Content-Disposition: indica download (attachment) e nome do arquivo
    res.setHeader('Content-Disposition', 'attachment; filename="user_report.xlsx"');

    // 14) Escrever workbook no stream de resposta (res)
    //     write() é assíncrono; retorna Promise
    //     Após write terminar, finaliza a resposta com res.end()
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    // 15) Tratamento de erros: retorna JSON com mensagem
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
