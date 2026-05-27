import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FiDownload, FiTrendingUp, FiDollarSign, FiUsers, FiPercent } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#667eea','#f093fb','#4facfe','#43e97b','#f5576c','#6b7280'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass p-3 text-sm">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/reports/dashboard').then(r => setData(r.data)); }, []);

  const handleExportPDF = () => {
    window.print();
    toast?.success?.('Exporting PDF...');
  };

  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    leads: data?.monthlyLeads?.find(l => l._id === i + 1)?.count || 0,
    revenue: data?.revenueByMonth?.find(r => r._id === i + 1)?.revenue || 0,
  }));

  const statusData = data?.leadsByStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  const kpis = [
    { label: 'Total Revenue', value: `$${((data?.convertedLeads || 0) * 1200).toLocaleString()}`, icon: FiDollarSign, color: '#43e97b', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { label: 'Conversion Rate', value: `${data?.conversionRate || 0}%`, icon: FiPercent, color: '#667eea', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { label: 'Total Leads', value: data?.totalLeads || 0, icon: FiTrendingUp, color: '#f093fb', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { label: 'Customers', value: data?.totalCustomers || 0, icon: FiUsers, color: '#4facfe', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Performance overview</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all">
          <FiDownload size={16} /> Export PDF
        </motion.button>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, gradient }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: gradient }}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-white/40 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#43e97b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#43e97b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#43e97b" fill="url(#revGrad)" strokeWidth={2} name="Revenue ($)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Monthly Leads</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="leads" fill="#667eea" radius={[6, 6, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Lead Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {statusData.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-white/50">{s.name}</span>
                  </div>
                  <span className="text-white font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
