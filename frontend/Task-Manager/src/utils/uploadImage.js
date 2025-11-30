// Importa objeto centralizado de caminhos da API.
// Facilita manter endpoints em um só lugar.
import { API_PATHS } from './apiPath';

// Instância Axios customizada (baseURL, interceptors para token / erros).
import axiosInstance from './axiosInstance';

/**
 * uploadImage
 * Faz upload de um único arquivo de imagem para o backend.
 *
 * @param {File|Blob} imageFile - Arquivo vindo de um <input type="file"> ou outra fonte.
 * @returns {Promise<any>} - Dados retornados pela API (ex.: { url, filename, ... }).
 * @throws Propaga o erro para quem chamou (para exibir mensagem ou log).
 */
const uploadImage = async (imageFile) => {
  // Cria um FormData que será serializado como multipart/form-data.
  const formData = new FormData();

  // Adiciona o arquivo sob a chave 'image' (deve bater com o nome esperado pelo backend / multer).
  formData.append('image', imageFile);

  try {
    // Envia POST para o endpoint de upload de imagem.
    // O Axios configura o boundary automaticamente no header multipart.
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: {
        // Explicitamos o content-type; boundary é gerado internamente.
        'Content-Type': 'multipart/form-data',
      },
    });

    // Retorna apenas o payload tratado (normalmente response.data contém URL e metadados).
    return response.data;
  } catch (error) {
    // Log simples para depuração (poderia ser substituído por toast).
    console.error('Error uploading the image', error);
    // Repassa o erro ao chamador para decidir o que fazer (retry, mensagem, etc.).
    throw error;
  }
};

// Export default para import convencional: import uploadImage from '...'
export default uploadImage;
