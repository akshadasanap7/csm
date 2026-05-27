import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FiUsers, FiTrendingUp, FiDollarSign, FiBell, FiActivity } from 'react-icons/fi';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#667eea','#f093fb','#4facfe','#43e97b','#f5576c','#6b7280'];

const StatCard = ({ label, value, icon: Icon, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="stat-card relative overflow-hidden"
  >
    <div className="absolute inset-0 opacity-10 rounded-2xl" style={{ background: gradient }} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: gradient }}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">This Month</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/50 mt-1">{label}</p>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass p-3 text-sm">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/reports/dashboard').then(r => setData(r.data)).catch(() => {});
  }, []);

  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    leads: data?.monthlyLeads?.find(l => l._id === i + 1)?.count || 0,
    revenue: data?.revenueByMonth?.find(r => r._id === i + 1)?.revenue || 0,
  }));

  const statusData = data?.leadsByStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  const stats = [
    { label: 'Total Customers', value: data?.totalCustomers || 0, icon: FiUsers, gradient: 'linear-gradient(135deg, #667eea, #764ba2)', delay: 0.1 },
    { label: 'Total Leads', value: data?.totalLeads || 0, icon: FiTrendingUp, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', delay: 0.2 },
    { label: 'Converted Leads', value: data?.convertedLeads || 0, icon: FiDollarSign, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', delay: 0.3 },
    { label: 'Pending Follow-Ups', value: data?.pendingFollowups || 0, icon: FiBell, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', delay: 0.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
            <FiTrendingUp size={16} className="text-blue-400" /> Monthly Leads & Revenue
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43e97b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#43e97b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" stroke="#667eea" fill="url(#leadsGrad)" strokeWidth={2} name="Leads" />
              <Area type="monotone" dataKey="revenue" stroke="#43e97b" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Lead Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-white/60">{s.name}</span>
                </div>
                <span className="text-white font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
          <FiActivity size={16} className="text-purple-400" /> Monthly Performance
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="leads" fill="#667eea" radius={[6, 6, 0, 0]} name="Leads" />
            <Bar dataKey="revenue" fill="#f093fb" radius={[6, 6, 0, 0]} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Prediction */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="glass-card p-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <span className="text-xs font-bold text-white">AI</span>
            </div>
            <h3 className="text-sm font-semibold text-white">AI Sales Prediction</h3>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">Beta</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Conversion Probability', value: `${data?.conversionRate || 0}%`, color: '#43e97b' },
              { label: 'Predicted Revenue', value: `$${((data?.convertedLeads || 0) * 1200).toLocaleString()}`, color: '#667eea' },
              { label: 'At-Risk Leads', value: data?.totalLeads ? Math.floor(data.totalLeads * 0.15) : 0, color: '#f5576c' },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-xs text-white/50 mb-1">{label}</p>
                <p className="text-xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
