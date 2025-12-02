const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Bolinha de cor separada do texto para evitar quebrar layout */}
      <span className={`inline-block w-2 h-2 md:w-3 md:h-3 ${color} rounded-full`} />
      {/* Texto do valor + label */}
      <p className="text-xs md:text-[14px] text-gray-500">
        <span className="text-sm md:text-[15px] text-black font-semibold">{value}</span> {label}
      </p>
      {/* Ícone opcional, se passado */}
      {icon && <span className="text-base md:text-lg text-gray-400 ml-auto">{icon}</span>}
    </div>
  );
};

export default InfoCard;
