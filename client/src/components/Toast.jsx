import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: "bg-white border-green-500",
      text: "text-green-800",
      iconColor: "text-green-500",
      Icon: CheckCircle,
    },
    error: {
      bg: "bg-white border-red-500",
      text: "text-red-800",
      iconColor: "text-red-500",
      Icon: XCircle,
    },
    warning: {
      bg: "bg-white border-amber-500",
      text: "text-amber-800",
      iconColor: "text-amber-500",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-white border-blue-500",
      text: "text-blue-800",
      iconColor: "text-blue-500",
      Icon: Info,
    },
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.Icon;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white shadow-lg max-w-sm transition-all duration-300 transform translate-y-0 ${config.bg}`}
        style={{ boxShadow: "0 10px 25px -5px rgba(0, 35, 111, 0.15)" }}
      >
        <Icon size={18} className={`flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1">
          <p className={`text-xs font-medium leading-normal ${config.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-lg hover:bg-gray-50 flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
