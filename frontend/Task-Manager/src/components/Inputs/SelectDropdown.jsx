import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

/**
 * SelectDropdown
 * Componente de dropdown customizado para substituir <select> nativo
 *
 * Props:
 * @param {Array} options - Array de objetos no formato [{ label: 'Label', value: 'value' }]
 * @param {string} value - Valor atualmente selecionado
 * @param {Function} onChange - Callback chamado quando usuário seleciona uma opção (recebe o value)
 * @param {string} placeholder - Texto exibido quando nenhum valor está selecionado
 */
const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  // Controla se o dropdown está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Lida com a seleção de uma opção
   * Chama onChange com o valor selecionado e fecha o dropdown
   */
  const handleSelect = (option) => {
    onChange(option); // Passa apenas o value (string) para o componente pai
    setIsOpen(false); // Fecha o menu após seleção
  };

  return (
    <div className="relative w-full">
      {/* Botão principal do dropdown - exibe o valor selecionado ou placeholder */}
      <button
        className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)} // Toggle: abre/fecha ao clicar
        type="button" // Previne submit acidental quando usado em <form>
      >
        {/* Busca o label correspondente ao value, ou mostra placeholder */}
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}

        {/* Ícone chevron que rotaciona quando aberto */}
        <span className="ml-2">
          {isOpen ? <LuChevronDown className="rotate-180" /> : <LuChevronDown />}
        </span>
      </button>

      {/* Menu dropdown - renderiza apenas quando isOpen === true */}
      {isOpen && (
        <div className="absolute bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
          {/* Mapeia cada opção para um item clicável */}
          {options.map((option) => (
            <div
              key={option.value} // Key única baseada no valor
              onClick={() => handleSelect(option.value)} // Seleciona ao clicar
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {option.label} {/* Texto exibido ao usuário */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
