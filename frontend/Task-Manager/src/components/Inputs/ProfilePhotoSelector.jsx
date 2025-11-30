import { useEffect, useRef, useState } from 'react';
import { LuTrash, LuUpload, LuUser } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Cleanup: revoke object URL ao trocar ou desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Sincroniza preview se image vier como string (edição)
  useEffect(() => {
    if (typeof image === 'string') {
      setPreviewUrl(image);
    } else if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação opcional: tipo e tamanho
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Formato inválido. Use JPEG, PNG, GIF ou WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo: 5MB.');
      return;
    }

    setImage(file);
    // preview será gerado no useEffect acima
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = ''; // limpa input
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative">
          <LuUser className="text-4xl text-primary" />
          <button
            type="button"
            aria-label="Enviar foto de perfil"
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:bg-primary/90 transition"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            aria-label="Remover foto de perfil"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:bg-red-600 transition"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
