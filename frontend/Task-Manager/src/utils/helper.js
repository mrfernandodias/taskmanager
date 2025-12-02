export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida nome completo (mínimo 2 palavras, cada uma com 2+ letras)
 * @param {string} fullName - Nome completo a validar
 * @returns {boolean} - true se válido
 *
 * Regras:
 * - Mínimo 2 palavras (ex.: "João Silva")
 * - Cada palavra deve ter no mínimo 2 caracteres
 * - Aceita letras, acentos, apóstrofos e hífens
 * - Ignora espaços extras no início/fim
 * - Comprimento total entre 5 e 100 caracteres
 */
export function validateFullName(fullName) {
  if (!fullName || typeof fullName !== 'string') return false;

  const trimmed = fullName.trim();

  // Comprimento: mínimo 5 (ex.: "Jo Si"), máximo 100
  if (trimmed.length < 5 || trimmed.length > 100) return false;

  // Apenas letras (incluindo acentuadas), espaços, hífens e apóstrofos
  const validCharsRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!validCharsRegex.test(trimmed)) return false;

  // Divide por espaços e filtra vazios (para lidar com múltiplos espaços)
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);

  // Mínimo 2 palavras
  if (words.length < 2) return false;

  // Cada palavra deve ter no mínimo 2 caracteres
  return words.every((word) => word.length >= 2);
}

/**
 * Normaliza nome completo: capitaliza primeira letra de cada palavra
 * @param {string} fullName - Nome a normalizar
 * @returns {string} - Nome formatado (ex.: "joão da silva" → "João da Silva")
 *
 * Observação: palavras com 1-2 letras (preposições) são mantidas minúsculas,
 * exceto se forem a primeira palavra.
 */
export function normalizeFullName(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';

  const trimmed = fullName.trim();
  const words = trimmed.split(/\s+/);

  // Lista de preposições comuns (mantidas em minúsculo, exceto no início)
  const prepositions = new Set(['de', 'da', 'do', 'dos', 'das', 'e']);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      // Se é preposição e não é a primeira palavra, mantém minúscula
      if (index > 0 && prepositions.has(lower)) {
        return lower;
      }
      // Capitaliza primeira letra
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export const addThousandsSeparator = (num) => {
  if (num === null || isNaN(num)) return '';

  const [integerPart, fractionalPart] = num.toString().split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};
