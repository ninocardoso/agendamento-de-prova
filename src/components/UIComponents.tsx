import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const FormLabel = ({ label, isDark }: { label: string, isDark?: boolean }) => (
  <label className={`block text-[10px] font-black uppercase mb-2 tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
);

export const Checkbox = ({ label, name, checked, onChange, isDark }: { label: string, name: string, checked: boolean, onChange: (e: any) => void, isDark?: boolean }) => (
  <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all group ${
    isDark 
      ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
      : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
  }`}>
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        name={name}
        checked={checked}
        onChange={onChange}
        className={`peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 transition-all checked:border-indigo-600 checked:bg-indigo-600 ${
          isDark ? 'border-slate-600' : 'border-slate-300'
        }`}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
    <span className={`text-xs font-bold group-hover:transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
  </label>
);

export const DetailItem = ({ icon, label, value, className, isDark }: { icon: React.ReactNode, label: string, value: string, className?: string, isDark?: boolean }) => (
  <div className="space-y-1.5">
    <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
      isDark ? 'text-slate-500' : 'text-slate-400'
    }`}>
      {icon} {label}
    </p>
    <p className={`text-sm font-bold ${className || (isDark ? 'text-white' : 'text-slate-700')}`}>{value}</p>
  </div>
);

export const StatusBadge = ({ label, isFit, isDark }: { label: string, isFit: boolean, isDark?: boolean }) => (
  <div className={`flex items-center justify-between p-3 rounded-2xl border ${
    isFit 
      ? isDark 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
        : 'bg-emerald-50 border-emerald-100 text-emerald-700'
      : isDark
        ? 'bg-red-500/10 border-red-500/30 text-red-400'
        : 'bg-red-50 border-red-100 text-red-700'
  }`}>
    <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    {isFit 
      ? <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} /> 
      : <XCircle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
    }
  </div>
);

export const StatCard = ({ icon, label, value, color, isActive, onClick, isDark }: { 
  icon: React.ReactNode, 
  label: string, 
  value: number | string, 
  color: 'indigo' | 'emerald' | 'amber' | 'blue' | 'red' | 'purple' | 'cyan',
  isActive?: boolean,
  onClick?: () => void,
  isDark?: boolean
}) => {
  const colors = {
    indigo: isActive 
      ? isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
      : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200',
    emerald: isActive 
      ? isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200',
    amber: isActive 
      ? isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-amber-100 text-amber-700 border-amber-200'
      : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200',
    blue: isActive 
      ? isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-blue-100 text-blue-700 border-blue-200'
      : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200',
    red: isActive 
      ? isDark ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-red-100 text-red-700 border-red-200'
      : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200',
    purple: isActive 
      ? isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-purple-100 text-purple-700 border-purple-200'
      : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200',
    cyan: isActive 
      ? isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-cyan-100 text-cyan-700 border-cyan-200'
      : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl border shadow-sm flex items-center gap-4 transition-all text-left w-full ${colors[color]} ${isActive ? 'scale-[1.02]' : 'hover:shadow-md'}`}
    >
      <div className={`p-3 rounded-xl ${colors[color].split(' ')[0]} border border-current/20 transition-colors`}>
        {icon}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{label}</p>
        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      </div>
    </button>
  );
};
