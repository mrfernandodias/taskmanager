// Placeholder de rotas de tarefas.
// O conteúdo anterior referenciava handlers ainda não implementados (ex.: getDashboardData, getTasks, etc.),
// o que geraria erros de runtime (ReferenceError) se o arquivo fosse carregado pelo servidor agora.
// Mantemos o planejamento abaixo para orientar a implementação futura.

// Planejado:
// const express = require('express');
// const { protect, adminOnly } = require('../middlewares/authMiddleware');
// const {
//   createTask,
//   getTasks,
//   getTaskById,
//   updateTask,
//   deleteTask,
//   updateTaskStatus,
//   updateTaskCheckList,
//   getDashboardData,
//   getUserDashboardData,
// } = require('../controllers/taskController');
// const router = express.Router();
// router.get('/dashboard-data', protect, getDashboardData);
// router.get('/user-dashboard-data', protect, getUserDashboardData);
// router.get('/', protect, getTasks);
// router.get('/:id', protect, getTaskById);
// router.post('/', protect, adminOnly, createTask);
// router.put('/:id', protect, updateTask);
// router.delete('/:id', protect, adminOnly, deleteTask);
// router.put('/:id/status', protect, updateTaskStatus);
// router.put('/:id/todo', protect, updateTaskCheckList);
// module.exports = router;

// Motivos para deixar como comentário agora:
// 1. Evitar imports quebrados até o controller ser implementado.
// 2. Permitir commit incremental e revisão clara.
// 3. Servir de checklist para próxima sessão.

// Próximos passos sugeridos:
//  - Definir schema de Task (status enum, checklist, assignedTo, deadlines, prioridade)
//  - Implementar createTask (admin) com validação
//  - Implementar getTasks com filtros (status, assignedTo, search, paginação)
//  - Implementar updateTaskStatus separado de updateTask (responsabilidade clara)
//  - Adicionar índices em campos consultados com frequência

// Arquivo exporta nada ainda para não ser carregado pelo server.
module.exports = {};
