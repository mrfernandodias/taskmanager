import { useEffect, useState } from 'react';
import { LuUsers } from 'react-icons/lu';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import AvatarGroup from '../AvatarGroup';
import Modal from '../Modal';

/**
 * SelectUsers
 * Componente para selecionar múltiplos usuários de uma lista
 * Exibe avatares dos usuários selecionados e modal para adicionar/remover membros
 *
 * Props:
 * @param {Array} selectedUsers - Array de IDs dos usuários já selecionados
 * @param {Function} setSelectedUsers - Função para atualizar usuários selecionados
 */
const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  // Estado para armazenar todos os usuários disponíveis (vem do backend)
  const [allUsers, setAllUsers] = useState([]);

  // Controla se o modal de seleção está aberto ou fechado
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Seleção temporária (só atualiza selectedUsers ao clicar em "DONE")
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  /**
   * Busca todos os usuários disponíveis do backend
   * Chamado uma vez quando o componente monta
   */
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  /**
   * Adiciona ou remove um usuário da seleção temporária
   * Se já está selecionado → remove | Se não está → adiciona
   */
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  /**
   * Abre o modal e sincroniza a seleção temporária com a seleção atual
   * Garante que checkboxes apareçam marcados para membros já atribuídos
   */
  const openModal = () => {
    setTempSelectedUsers(selectedUsers); // Sincroniza estado temporário com atual
    setIsModalOpen(true);
  };

  /**
   * Confirma a seleção: atualiza selectedUsers e fecha o modal
   */
  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  /**
   * Filtra usuários selecionados e formata para { url, name }
   * Usado para exibir avatares com tooltips dos membros já atribuídos
   */
  const selectedUsersAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => ({ url: user.profileImageUrl, name: user.name }));

  // Busca lista de usuários quando o componente monta
  useEffect(() => {
    getAllUsers();
  }, []);

  // Reseta seleção temporária quando todos os usuários são removidos
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {/* Exibe botão "Add Members" se não houver usuários selecionados */}
      {selectedUsersAvatars.length === 0 && (
        <button className="card-btn" onClick={openModal}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {/* Exibe avatares dos usuários selecionados (clicável para editar) */}
      {selectedUsersAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={openModal}>
          <AvatarGroup avatars={selectedUsersAvatars} maxVisible={3} />
        </div>
      )}

      {/* Modal com lista de usuários para seleção */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
        {/* Lista de usuários com scroll vertical */}
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div key={user._id} className="flex items-center gap-4 p-3 border-b border-gray-200">
              {/* Avatar do usuário */}
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback para imagem padrão caso URL seja inválida
                  e.target.src = '/default-avatar.png';
                }}
              />

              {/* Informações do usuário */}
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              {/* Checkbox para selecionar/desselecionar */}
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Botões de ação do modal */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
