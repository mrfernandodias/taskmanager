import moment from 'moment';
import { LuPaperclip } from 'react-icons/lu';
import AvatarGroup from '../AvatarGroup';
import Progress from '../Progress';

/**
 * TaskCard - Componente de cartão para exibir informações de uma tarefa
 *
 * Props:
 * @param {string} title - Título da tarefa
 * @param {string} description - Descrição da tarefa
 * @param {string} priority - Prioridade: 'Low', 'Medium', 'High'
 * @param {string} status - Status: 'Pending', 'In Progress', 'Completed'
 * @param {number} progress - Progresso em porcentagem (0-100)
 * @param {string} createdAt - Data de criação (ISO string)
 * @param {string} dueDate - Data de vencimento (ISO string)
 * @param {Array} assignedTo - Array de usuários atribuídos
 * @param {number} attachmentCount - Número de anexos
 * @param {number} completedTodoCount - Número de tarefas concluídas
 * @param {Array} todoChecklist - Array de itens do checklist
 * @param {function} onClick - Função chamada ao clicar no card
 */
const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  // Retorna classes de cor do badge de status baseado no status da tarefa
  const getStatusTagColor = () => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
      case 'Completed':
        return 'text-lime-500 bg-lime-50 border border-lime-500/20';
      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  // Retorna classes de cor do badge de prioridade baseado na prioridade da tarefa
  const getPriorityColor = () => {
    switch (priority) {
      case 'Low':
        return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10';
      case 'Medium':
        return 'text-amber-500 bg-amber-50 border border-amber-500/10';
      default:
        return 'text-rose-500 bg-rose-50 border border-rose-500/10';
    }
  };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
          {status}
        </div>
        <div className={`text-[11px] font-medium ${getPriorityColor()} px-4 py-0.5 rounded`}>
          {priority} Priority
        </div>
      </div>
      <div
        className={`px-4 border-l-[3px] ${
          status === 'In Progress'
            ? 'border-cyan-500'
            : status === 'Completed'
            ? 'border-lime-500'
            : 'border-violet-500'
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">{title}</p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">{description}</p>

        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Task Done:{' '}
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist?.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label htmlFor="" className="text-xs text-gray-500">
              Start Date
            </label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format('Do MMM YYYY')}
            </p>
          </div>
          <div className="">
            <label htmlFor="" className="text-xs text-gray-500">
              Due Date
            </label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format('Do MMM YYYY')}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary" />{' '}
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
