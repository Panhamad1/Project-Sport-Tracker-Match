const formStyles = {
  W: "bg-emerald-500/15 text-emerald-300",
  D: "bg-yellow-500/15 text-yellow-300",
  L: "bg-red-500/15 text-red-300",
};

const FormBadge = ({ letter }) => {
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${formStyles[letter] || "bg-[#1a1a1a] text-gray-400"}`}>
      {letter}
    </span>
  );
};

export default FormBadge;
