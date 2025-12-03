/**
 * AvatarGroup
 * Componente que exibe múltiplos avatares sobrepostos
 * Mostra apenas os primeiros N avatares e um contador para os demais
 *
 * Props:
 * @param {Array<string|object>} avatars - Array de URLs ou objetos { url, name }
 * @param {number} maxVisible - Quantidade máxima de avatares visíveis (padrão: 3)
 */
const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  // Guard clause: não renderiza nada se não houver avatares
  if (!avatars || avatars.length === 0) return null;

  return (
    <div className="flex items-center">
      {/* Exibe apenas os primeiros N avatares (definido por maxVisible) */}
      {avatars.slice(0, maxVisible).map((avatar, index) => {
        // Suporta tanto string (URL) quanto objeto { url, name }
        const avatarUrl = typeof avatar === 'string' ? avatar : avatar.url;
        const avatarName = typeof avatar === 'object' ? avatar.name : `User ${index + 1}`;

        return (
          <img
            key={index} // Idealmente usar ID único, mas index funciona para lista estática
            src={avatarUrl}
            alt={avatarName}
            title={avatarName} // Tooltip nativo do browser ao passar o mouse
            className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover cursor-pointer"
            onError={(e) => {
              // Fallback para imagem padrão caso URL seja inválida
              e.target.src = '/default-avatar.png';
            }}
          />
        );
      })}

      {/* Contador de avatares restantes (só aparece se houver mais que maxVisible) */}
      {avatars.length > maxVisible && (
        <div
          className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3 cursor-pointer"
          title={`+${avatars.length - maxVisible} more users`} // Tooltip no contador
        >
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
