import { useEffect, useState } from 'react';
import { LuFileSpreadsheet } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../../components/Cards/TaskCard';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [statusSummary, setStatusSummary] = useState(null);

  const navigate = useNavigate();

  // Buscar todas as tarefas com filtro opcional de status
  const getAllTasks = async () => {
    try {
      // Fazer requisição GET para buscar tarefas
      // Se filterStatus for 'All', envia string vazia (busca todas)
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === 'All' ? '' : filterStatus,
        },
      });

      // Atualizar lista de tarefas ou array vazio se não houver tarefas
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Armazenar statusSummary apenas quando buscar "All" (contém os totais corretos)
      if (filterStatus === 'All' && response.data?.statusSummary) {
        setStatusSummary(response.data.statusSummary);
      }

      // Usar o statusSummary armazenado ou o retornado
      // Ao filtrar por status específico, usa o summary armazenado para manter counts corretos
      const summary =
        filterStatus === 'All' ? response.data?.statusSummary || {} : statusSummary || {};

      // Criar array de tabs com labels e contadores
      const statusArray = [
        { label: 'All', count: summary.all || 0 },
        { label: 'Pending', count: summary.pendingTasks || 0 },
        { label: 'In Progress', count: summary.inProgressTasks || 0 },
        { label: 'Completed', count: summary.completedTasks || 0 },
      ];

      // Atualizar tabs com novos contadores
      setTabs(statusArray);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  // Navegar para a página de edição da tarefa
  const handleClick = (taskId) => {
    navigate('/admin/create-task', { state: { taskId } });
  };

  // Baixar relatório de tarefas (a implementar)
  const handleDownloadReport = async () => {
    console.log('Download Report has clicked');
  };

  // Recarregar tarefas sempre que o filtro de status mudar
  useEffect(() => {
    getAllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks </h2>

            <button
              className="flex lg:hidden download-btn"
              type="button"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus} />
              <button
                className="hidden lg:flex download-btn"
                type="button"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Renderizar cards de tarefas */}
        {allTasks?.map((item) => (
          <TaskCard
            key={item._id}
            title={item.title}
            description={item.description}
            priority={item.priority}
            status={item.status}
            progress={item.progress}
            createdAt={item.createdAt}
            dueDate={item.dueDate}
            assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
            attachmentCount={item.attachments?.length || 0}
            completedTodoCount={item.completedTodoCount || 0}
            todoChecklist={item.todoChecklist || []}
            onClick={() => {
              handleClick(item._id);
            }}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
