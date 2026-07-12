import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaTimes } from "react-icons/fa";

const AdminToast = ({ toast, onClose }) => {
  if(!toast){
    return null;
  }

  const toastStyle = toast.type === "success"
    ? "bg-green-950/95 border-green-700 text-green-100"
    : toast.type === "error"
      ? "bg-red-950/95 border-red-700 text-red-100"
      : "bg-[#111111]/95 border-[#8b5cf6]/40 text-white";

  return (
    <div className={`fixed top-24 right-6 z-50 w-[min(420px,calc(100vw-2rem))] border rounded-lg p-4 shadow-xl ${toastStyle}`}>
      <div className="flex items-start gap-3">
        {toast.type === "success" && <FaCheckCircle className="mt-1 text-green-400" />}
        {toast.type === "error" && <FaExclamationTriangle className="mt-1 text-red-400" />}
        {toast.type === "loading" && <FaSpinner className="mt-1 text-[#8b5cf6] animate-spin" />}
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{toast.title}</p>
          <p className="text-sm opacity-90 mt-1 break-words max-h-24 overflow-y-auto pr-1">{toast.message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white transition-colors"
            title="Close message"
          >
            <FaTimes className="text-xs" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminToast;
