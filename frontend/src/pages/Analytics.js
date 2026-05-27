import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiDownload, FiTrendingUp, FiDollarSign, FiUsers, FiPercent } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#667eea','#f093fb','#4facfe','#43e97b','#f5576c','#6b7280'];
const card = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '20px' };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(15,12,41,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.color, fontSize: '13px', margin: 0 }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/reports/dashboard').then(r => setData(r.data)); }, []);

  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    leads: data?.monthlyLeads?.find(l => l._id === i + 1)?.count || 0,
    revenue: data?.revenueByMonth?.find(r => r._id === i + 1)?.revenue || 0,
  }));
  const statusData = data?.leadsByStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  const kpis = [
    { label: 'Total Revenue', value: `$${((data?.convertedLeads || 0) * 1200).toLocaleString()}`, color: '#43e97b', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', icon: FiDollarSign },
    { label: 'Conversion Rate', value: `${data?.conversionRate || 0}%`, color: '#667eea', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', icon: FiPercent },
    { label: 'Total Leads', value: data?.totalLeads || 0, color: '#f093fb', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', icon: FiTrendingUp },
    { label: 'Customers', value: data?.totalCustomers || 0, color: '#4facfe', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', icon: FiUsers },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>Sales Analytics</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Performance overview</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { window.print(); toast.success('Printing...'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', cursor: 'pointer' }}>
          <FiDownload size={16} /> Export PDF
        </motion.button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {kpis.map(({ label, value, color, gradient, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ ...card, padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Icon size={18} color="white" />
            </div>
            <p style={{ fontSize: '26px', fontWeight: '700', color, margin: 0 }}>{value}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ ...card, marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#43e97b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#43e97b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#43e97b" fill="url(#revGrad)" strokeWidth={2} name="Revenue ($)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={card}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>Monthly Leads</h3>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={card}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>Lead Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie data={statusData.length ? statusData : [{ name: 'No Data', value: 1 }]} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {(statusData.length ? statusData : [{}]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {statusData.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>{s.value}</span>
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
