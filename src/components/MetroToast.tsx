import React from 'react';
import { useErp } from '../context/ErpContext';
import { CheckCircle2, AlertOctagon, Info, AlertTriangle, X } from 'lucide-react';

export const MetroToast: React.FC = () => {
  const { toast, closeToast } = useErp();

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-[#107c41]',
          border: 'border-[#0c5e31]',
          icon: CheckCircle2,
        };
      case 'error':
        return {
          bg: 'bg-[#ce352c]',
          border: 'border-[#a8251e]',
          icon: AlertOctagon,
        };
      case 'warning':
        return {
          bg: 'bg-[#fa6800]',
          border: 'border-[#c75200]',
          icon: AlertTriangle,
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#0050ef]',
          border: 'border-[#003db8]',
          icon: Info,
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200 no-print">
      <div className={`${style.bg} text-white p-3.5 shadow-xl border-l-4 ${style.border} flex items-start justify-between gap-3`}>
        <div className="flex items-start gap-2.5">
          <Icon className="w-5 h-5 shrink-0 mt-0.5 text-white/90" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider leading-tight">
              {toast.title}
            </div>
            <div className="text-xs text-white/90 mt-1 leading-snug">
              {toast.message}
            </div>
          </div>
        </div>

        <button
          onClick={closeToast}
          className="text-white/80 hover:text-white p-0.5 cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
