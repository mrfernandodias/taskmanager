const multer = require('multer');

// Configuração de armazenamento no disco (diskStorage)
// - destination: onde salvar o arquivo (pasta uploads/)
// - filename: como será o nome do arquivo salvo
const storage = multer.diskStorage({
  // destination recebe (req, file, cb)
  // cb é o "callback" do multer (padrão erro-primeiro):
  //   - chame cb(null, 'uploads/') para indicar a pasta sem erro
  //   - chame cb(err) se quiser abortar com erro
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  // filename recebe (req, file, cb)
  // Define o nome do arquivo no disco.
  // Aqui usamos timestamp + nome original para reduzir colisões.
  // Ex.: 1700000000000-foto.png
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtro de arquivos (fileFilter) decide aceitar/rejeitar o upload
// - cb(null, true) aceita
// - cb(null, false) rejeita sem erro
// - cb(new Error('mensagem'), false) rejeita com erro
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  // file.mimetype é o tipo MIME enviado pelo cliente (ex.: 'image/jpeg')
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // aceita o arquivo
  } else {
    cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false); // rejeita
  }
};

// Instância do upload com storage + filtro
const upload = multer({ storage, fileFilter });

module.exports = upload;
