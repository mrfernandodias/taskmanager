import { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';

/**
 * AddAttachmentsInput - Componente para gerenciar anexos/links de tarefas
 *
 * Funcionalidades:
 * - Adicionar URLs de anexos com validação
 * - Deletar anexos da lista
 * - Suporte a teclado (Enter para adicionar)
 * - Prevenção de URLs duplicadas
 * - Validação de campo vazio
 *
 * Props:
 * @param {string[]} attachments - Array de URLs de anexos
 * @param {function} setAttachments - Setter do estado para atualizar o array de anexos
 */
const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  // Estado local para o valor do campo de input
  const [option, setOption] = useState('');

  /**
   * Validação simples de URL
   * Verifica se a string contém padrões comuns de URL
   */
  const isValidURL = (str) => {
    const urlPattern =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return urlPattern.test(str);
  };

  /**
   * Manipula a adição de uma nova URL de anexo à lista
   * Validações: não vazio, formato de URL válido, sem duplicatas
   */
  const handleAddOption = () => {
    const trimmedValue = option.trim();

    // Validate: not empty
    if (!trimmedValue) {
      alert('Por favor, insira uma URL válida');
      return;
    }

    // Validate: URL format
    if (!isValidURL(trimmedValue)) {
      alert('Por favor, insira uma URL válida (ex: https://exemplo.com/arquivo.pdf)');
      return;
    }

    // Validate: no duplicates
    if (attachments.includes(trimmedValue)) {
      alert('Esta URL já foi adicionada');
      return;
    }

    // Add to list and clear input
    setAttachments([...attachments, trimmedValue]);
    setOption('');
  };

  /**
   * Remove um anexo da lista pelo índice
   */
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  /**
   * Manipula o pressionamento da tecla Enter para adicionar anexo
   * Previne o envio do formulário ao pressionar Enter
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="">
      {/* Lista de anexos - Exibe todas as URLs adicionadas com opção de deletar */}
      {attachments.map((item, index) => (
        // Item de anexo com ícone, texto da URL e botão de deletar
        <div
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
          key={`${item}-${index}`}
        >
          {/* Display da URL do anexo com ícone de clipe */}
          <div className="flex-1 flex items-center gap-3">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black truncate" title={item}>
              {item}
            </p>
          </div>
          {/* Botão de deletar - Remove anexo da lista */}
          <button
            className="cursor-pointer hover:opacity-70 transition-opacity"
            type="button"
            onClick={() => {
              handleDeleteOption(index);
            }}
            aria-label="Remover anexo"
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}
      {/* Seção de input - Adicionar nova URL de anexo */}
      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />
          <input
            type="text"
            placeholder="Adicionar link de arquivo (ex: https://exemplo.com/arquivo.pdf)"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-[13px] text-black outline-none bg-white py-2"
          />
        </div>
        {/* Botão adicionar - Dispara a adição de URL de anexo com validação */}
        <button className="card-btn text-nowrap" type="button" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
