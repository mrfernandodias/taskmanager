import { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';

/**
 * TodoListInput
 * Componente para criar e gerenciar uma lista de checklist (tarefas TODO)
 * Permite adicionar novos itens e deletar existentes
 *
 * Props:
 * @param {Array<string>} todoList - Array de strings com os itens do checklist
 * @param {Function} setTodoList - Função para atualizar a lista de itens
 */
const TodoListInput = ({ todoList, setTodoList }) => {
  // Estado local para o input de novo item
  const [option, setOption] = useState('');

  /**
   * Adiciona um novo item à lista
   * Valida se não está vazio e evita duplicatas
   */
  const handleAddOption = () => {
    const trimmedOption = option.trim();

    // Valida se não está vazio e se não existe duplicata
    if (trimmedOption && !todoList.includes(trimmedOption)) {
      setTodoList([...todoList, trimmedOption]);
      setOption(''); // Limpa o input após adicionar
    }
  };

  /**
   * Remove um item da lista pelo índice
   */
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  /**
   * Permite adicionar item pressionando Enter
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita submit de form se estiver dentro de um
      handleAddOption();
    }
  };

  return (
    <div>
      {/* Lista de itens do checklist */}
      {todoList.map((item, index) => (
        <div
          key={`${item}-${index}`} // Combinação de item + index para key única
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-black">
            {/* Numeração com padding zero (01, 02, ..., 10, 11) */}
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          {/* Botão para deletar item */}
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* Input para adicionar novo item */}
      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          onKeyDown={handleKeyDown} // Suporta tecla Enter
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        {/* Botão para adicionar item */}
        <button type="button" className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
