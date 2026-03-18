import React, { useMemo, useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  Calendar, 
  CheckCircle2,
  TrendingUp, 
  FileText,
  RefreshCw,
  Ticket as TicketIcon,
  Activity,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Appointment, Ticket } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface HomeViewProps {
  appointments: Appointment[];
  tickets: Ticket[];
  onNavigate: (view: 'appointments' | 'tickets') => void;
  onSync: () => void;
  isLoading: boolean;
  lastSyncTime: string | null;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const COLORS_DARK = ['#818cf8', '#34d399', '#fbbf24', '#f87171'];

export const HomeView: React.FC<HomeViewProps> = ({ appointments, tickets, onNavigate, onSync, isLoading, lastSyncTime }) => {
  const { isDark } = useTheme();
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    let total = 0, confirmed = 0, pending = 0, requestSent = 0, today = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    
    for (const app of appointments) {
      total++;
      if (app.isConfirmed) confirmed++;
      else pending++;
      if (app.isRequestSent) requestSent++;
      if (app.appointmentDate === todayStr) today++;
    }
    
    const confirmedRate = total > 0 ? (confirmed / total) * 100 : 0;
    
    return { total, confirmed, pending, requestSent, confirmedRate, today, sgaCrt: tickets.length };
  }, [appointments, tickets]);

  const chartData = useMemo(() => {
    const last7Days: Record<string, { date: string, total: number, confirmed: number }> = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      last7Days[dateStr] = { date: displayDate, total: 0, confirmed: 0 };
    }

    for (const app of appointments) {
      const day = last7Days[app.appointmentDate];
      if (day) {
        day.total++;
        if (app.isConfirmed) day.confirmed++;
      }
    }

    return Object.values(last7Days);
  }, [appointments]);

  const pieData = useMemo(() => [
    { name: 'Confirmados', value: stats.confirmed },
    { name: 'Pendentes', value: stats.pending }
  ], [stats]);

  const examTypeData = useMemo(() => {
    const types: Record<string, number> = {};
    for (const app of appointments) {
      types[app.examType] = (types[app.examType] || 0) + 1;
    }
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  const chartColors = isDark ? COLORS_DARK : COLORS;

  return (
    <div className="col-span-1 lg:col-span-12 space-y-6 pb-12">
      {/* Header com relógio */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/40' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30'
              }`}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -inset-1 rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-sm' : ''}`} />
            </div>
            <div>
              <h2 className={`text-2xl lg:text-3xl font-black ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent'
              }`}>
                Dashboard
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-emerald-500' : 'bg-emerald-500'}`}></span>
                </span>
                <span className={isDark ? 'text-emerald-400 font-medium' : 'text-emerald-600 font-medium'}>Live</span>
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>•</span>
                <span className={`font-mono ${isDark ? 'text-indigo-400' : 'text-slate-500'}`}>{time.toLocaleTimeString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button 
            onClick={onSync}
            disabled={isLoading}
            className={`p-3 rounded-xl transition-all shadow-lg ${
              isLoading 
                ? `${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} ${isDark ? 'text-slate-500' : 'text-slate-400'} cursor-not-allowed` 
                : `${isDark ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700/80 shadow-indigo-500/10' : 'bg-white border border-slate-200 hover:bg-slate-50 shadow-indigo-100'} ${isDark ? 'text-indigo-400' : 'text-indigo-600'} active:scale-95`
            }`}
            title="Sincronizar dados"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className={`px-5 py-3 rounded-xl shadow-lg border ${isDark ? 'bg-slate-800/80 border-slate-700 shadow-black/20' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
            <div className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              {time.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
            {lastSyncTime && (
              <div className={`flex items-center gap-1.5 text-[10px] font-medium mt-0.5 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}>
                <Clock className="w-3 h-3" />
                Sync {lastSyncTime}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats Cards - Grid Moderno */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Users, gradient: 'from-indigo-500 to-indigo-600', trend: `${stats.total} registros`, glow: 'hover:shadow-indigo-500/20' },
          { label: 'Confirmados', value: stats.confirmed, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-600', trend: `${stats.confirmedRate.toFixed(0)}% do total`, glow: 'hover:shadow-emerald-500/20' },
          { label: 'Para Hoje', value: stats.today, icon: Calendar, gradient: 'from-amber-500 to-orange-500', trend: 'agendamentos', glow: 'hover:shadow-amber-500/20' },
          { label: 'SGA/CRT', value: stats.sgaCrt, icon: TicketIcon, gradient: 'from-purple-500 to-pink-500', trend: 'chamados', glow: 'hover:shadow-purple-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className={`relative group overflow-hidden rounded-2xl ${isDark ? 'bg-slate-800/80 border border-slate-700' : 'bg-white border border-slate-200/50'} shadow-lg hover:shadow-xl ${stat.glow} transition-all duration-300`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
            <div className="relative p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className={`text-3xl lg:text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
              <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.trend}</p>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-tl ${stat.gradient} opacity-5 rounded-tl-full`} />
          </motion.div>
        ))}
      </div>

      {stats.total === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-12 rounded-3xl border text-center space-y-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'}`}
        >
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto ${isDark ? 'bg-slate-700' : 'bg-gradient-to-br from-indigo-100 to-purple-100'}`}>
            <Calendar className={`w-10 h-10 ${isDark ? 'text-indigo-400' : 'text-indigo-400'}`} />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Sistema Pronto</h3>
          <p className={`max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Adicione seu primeiro agendamento para visualizar as estatísticas.</p>
          <button 
            onClick={() => onNavigate('appointments')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all"
          >
            Começar
          </button>
        </motion.div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`lg:col-span-2 rounded-2xl border overflow-hidden shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-700 shadow-black/30' : 'bg-white border-slate-200/50 shadow-slate-200/30'}`}
            >
              <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Fluxo de Agendamentos</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Últimos 7 dias</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Confirmados</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[280px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isDark ? "#818cf8" : "#6366f1"} stopOpacity={0.15}/>
                        <stop offset="95%" stopColor={isDark ? "#818cf8" : "#6366f1"} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradConfirmed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isDark ? "#34d399" : "#10b981"} stopOpacity={0.15}/>
                        <stop offset="95%" stopColor={isDark ? "#34d399" : "#10b981"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: isDark ? '#94a3b8' : '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: isDark ? '#94a3b8' : '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: isDark ? '1px solid #475569' : '1px solid #e2e8f0', 
                        backgroundColor: isDark ? '#1e293b' : 'white',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
                      }}
                      labelStyle={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#1e293b' }}
                    />
                    <Area type="monotone" dataKey="total" stroke={isDark ? "#818cf8" : "#6366f1"} strokeWidth={2.5} fill="url(#gradTotal)" />
                    <Area type="monotone" dataKey="confirmed" stroke={isDark ? "#34d399" : "#10b981"} strokeWidth={2.5} fill="url(#gradConfirmed)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`rounded-2xl border overflow-hidden shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-700 shadow-black/30' : 'bg-white border-slate-200/50 shadow-slate-200/30'}`}
            >
              <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Status</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Visão geral</p>
              </div>
              <div className="p-6">
                <div className="h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.confirmedRate.toFixed(0)}%</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Confirmado</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {pieData.map((item, i) => (
                    <div key={item.name} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[i] }} />
                        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.name}</span>
                      </div>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden ${isDark ? 'shadow-indigo-500/20' : 'shadow-indigo-500/20'}`}
            >
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Acesso Rápido</h3>
                    <p className="text-indigo-100 text-xs">Navegue rapidamente</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onNavigate('appointments')}
                    className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all group"
                  >
                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">Agendamentos</span>
                  </button>
                  <button 
                    onClick={() => onNavigate('tickets')}
                    className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all group"
                  >
                    <TicketIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">Chamados</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Exam Types */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className={`rounded-2xl border overflow-hidden shadow-lg ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200/50'}`}
            >
              <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tipos de Exame</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Distribuição</p>
                  </div>
                  <FileText className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {examTypeData.map((item, i) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.name}</span>
                      <span className={isDark ? 'text-white' : 'text-slate-900'}>{item.value}</span>
                    </div>
                    <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / stats.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + (i * 0.1) }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};
