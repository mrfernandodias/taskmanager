import { useEffect, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { PRIORITY_DATA } from '../../utils/data';

import moment from 'moment';
import toast from 'react-hot-toast';
import DeleteAlert from '../../components/DeleteAlert';
import Modal from '../../components/Modal';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // Criar nova tarefa
  const createTask = async () => {
    setLoading(true);

    try {
      // Transformar array de strings em array de objetos para o checklist
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false, // Novos itens sempre começam como não concluídos
      }));

      // Enviar requisição POST para criar a tarefa
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(), // Converter data para formato ISO
        todoChecklist: todoList,
      });

      // Exibir mensagem de sucesso
      toast.success('Task created successfully');
      // Limpar formulário após criar
      clearData();
    } catch (error) {
      // Exibir erro ao usuário
      toast.error('Error creating task');
      console.error('Error creating task', error);
    } finally {
      // Sempre desabilitar loading state ao finalizar
      setLoading(false);
    }
  };

  // Atualizar tarefa existente
  const updateTask = async () => {
    setLoading(true);

    try {
      // Transformar checklist preservando o estado 'completed' dos itens existentes
      const todoList = taskData.todoChecklist?.map((item) => {
        // item = texto do checklist (string) ex: "Fazer a daily"

        // Buscar checklist original do backend (antes da edição)
        const prevTodoChecklist = currentTask?.todoChecklist || [];

        // Verificar se o item já existia no checklist original
        const matchedTask = prevTodoChecklist.find((task) => task.text === item);

        // Retornar objeto no formato esperado pela API
        return {
          text: item,
          // Se encontrou o item no checklist original, preserva o estado completed
          // Se é um item novo, marca como false (não concluído)
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      // Exibir mensagem de sucesso
      toast.success('Task updated successfully');
      // Redirecionar para a lista de tarefas
      navigate('/admin/tasks');
    } catch (error) {
      toast.error('Error updating task');
      console.error('Error updating task:', error);
    } finally {
      // Sempre desabilitar loading state ao finalizar
      setLoading(false);
    }
  };

  // Função principal de submit - valida e chama create ou update
  const handleSubmit = async () => {
    // Limpar erro anterior
    setError(null);

    // Validação de campos obrigatórios
    if (!taskData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!taskData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!taskData.dueDate) {
      setError('Due date is required.');
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError('Task not assigned to any members');
      return;
    }

    if (taskData.todoChecklist?.length === 0) {
      setError('Add at least one todo task');
      return;
    }

    // Se taskId existe, estamos no modo de edição
    if (taskId) {
      updateTask();
      return;
    }

    // Caso contrário, criar nova tarefa
    createTask();
  };

  // Buscar detalhes da tarefa por ID (modo edição)
  const getTaskDetailsById = async () => {
    try {
      // Fazer requisição GET para buscar a tarefa
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

      if (response.data) {
        const taskInfo = response.data;
        // Armazenar tarefa completa para referência (usado no updateTask)
        setCurrentTask(taskInfo);

        // Preencher formulário com os dados da tarefa
        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          // Formatar data para o input type="date" (YYYY-MM-DD)
          dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : null,
          // Extrair apenas os IDs dos usuários atribuídos
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          // Extrair apenas os textos do checklist
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          // Preservar anexos
          attachments: taskInfo?.attachments || [],
        });
      }
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  // Deletar tarefa
  const deleteTask = async () => {
    try {
      if (taskId) {
        // Enviar requisição DELETE para remover a tarefa
        await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
        // Fechar modal de confirmação
        setOpenDeleteAlert(false);
        // Exibir mensagem de sucesso
        toast.success('Task deleted successfully');
        // Redirecionar para a lista de tarefas
        navigate('/admin/tasks');
      }
    } catch (error) {
      console.error('Error deleting task', error.response?.data.message || error.message);
    }
  };

  // Carregar dados da tarefa quando em modo de edição
  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer "
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                type="text"
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) => handleValueChange('title', target.value)}
              />
            </div>

            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData?.description}
                onChange={({ target }) => handleValueChange('description', target.value)}
              ></textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label htmlFor="" className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData?.priority}
                  onChange={(value) => handleValueChange('priority', value)}
                  placeholder="Select Priority"
                ></SelectDropdown>
              </div>
              <div className="col-span-6 md:col-span-4">
                <label htmlFor="" className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  className="form-input"
                  value={taskData?.dueDate}
                  onChange={({ target }) => handleValueChange('dueDate', target.value)}
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label htmlFor="" className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) => handleValueChange('todoChecklist', value)}
              />
            </div>

            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>

              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) => handleValueChange('attachments', value)}
              />
            </div>

            {error && <p className="text-xs font-medium text-red-500 mt-5">{error}</p>}

            <div className="flex justify-end mt-7">
              <button className="add-btn" type="button" onClick={handleSubmit} disabled={loading}>
                {taskId ? 'UPDATE TASK' : 'CREATE TASK'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} title="Delete Task">
        <DeleteAlert content="Are you sure you want to delete this task?" onDelete={deleteTask} />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
