import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toast, clearToast } = useStore();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />,
    info: <Info className="w-6 h-6 text-amber-400 shrink-0" />
  };

  const borderMap = {
    success: 'border-emerald-500/40 bg-zinc-900/95 text-emerald-100',
    error: 'border-rose-500/40 bg-zinc-900/95 text-rose-100',
    info: 'border-amber-500/40 bg-zinc-900/95 text-amber-100'
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-md w-full p-1 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${borderMap[toast.type]}`}>
        {iconMap[toast.type]}
        <div className="flex-1 text-right">
          <h4 className="font-bold text-sm text-white mb-0.5">{toast.title}</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-zinc-400 hover:text-white transition p-1 rounded-lg hover:bg-zinc-800"
          aria-label="إغلاق الإشعار"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
