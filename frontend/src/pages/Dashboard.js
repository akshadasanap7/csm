import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FiUsers, FiTrendingUp, FiDollarSign, FiBell, FiActivity, FiUserPlus } from 'react-icons/fi';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#667eea','#f093fb','#4facfe','#43e97b','#f5576c','#6b7280'];

const card = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '20px',
  padding: '20px',
};

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

const StatCard = ({ label, value, icon: Icon, gradient, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    style={{ ...card, position: 'relative', overflow: 'hidden', cursor: 'default' }}
    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
    <div style={{ position: 'absolute', inset: 0, background: gradient, opacity: 0.08, borderRadius: '20px' }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color="white" />
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>This Month</span>
      </div>
      <p style={{ fontSize: '32px', fontWeight: '700', color: 'white', margin: 0 }}>{value}</p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{label}</p>
    </div>
  </motion.div>
);

const roleGradient = {
  admin: 'linear-gradient(135deg, #f5576c, #f093fb)',
  manager: 'linear-gradient(135deg, #667eea, #764ba2)',
  sales: 'linear-gradient(135deg, #43e97b, #38f9d7)',
};
const roleLabel = { admin: 'Admin', manager: 'Manager', sales: 'Sales' };

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const role = user?.role;

  useEffect(() => {
    api.get('/reports/dashboard').then(r => setData(r.data)).catch(() => {});
  }, []);

  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    leads: data?.monthlyLeads?.find(l => l._id === i + 1)?.count || 0,
    revenue: data?.revenueByMonth?.find(r => r._id === i + 1)?.revenue || 0,
  }));

  const statusData = data?.leadsByStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  // Role-based stat cards
  const adminManagerStats = [
    { label: 'Total Customers', value: data?.totalCustomers || 0, icon: FiUsers, gradient: 'linear-gradient(135deg, #667eea, #764ba2)', delay: 0.1 },
    { label: 'Total Leads', value: data?.totalLeads || 0, icon: FiTrendingUp, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', delay: 0.2 },
    { label: 'Converted Leads', value: data?.convertedLeads || 0, icon: FiDollarSign, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', delay: 0.3 },
    { label: 'Pending Follow-Ups', value: data?.pendingFollowups || 0, icon: FiBell, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', delay: 0.4 },
    { label: 'Total Employees', value: data?.totalEmployees || 0, icon: FiUserPlus, gradient: 'linear-gradient(135deg, #f5576c, #f093fb)', delay: 0.5 },
  ];

  const salesStats = [
    { label: 'My Customers', value: data?.totalCustomers || 0, icon: FiUsers, gradient: 'linear-gradient(135deg, #667eea, #764ba2)', delay: 0.1 },
    { label: 'My Leads', value: data?.totalLeads || 0, icon: FiTrendingUp, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', delay: 0.2 },
    { label: 'Converted', value: data?.convertedLeads || 0, icon: FiDollarSign, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', delay: 0.3 },
    { label: 'My Follow-Ups', value: data?.pendingFollowups || 0, icon: FiBell, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', delay: 0.4 },
  ];

  const stats = role === 'sales' ? salesStats : adminManagerStats;

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>
            {role === 'sales' ? 'My Dashboard' : role === 'manager' ? 'Manager Dashboard' : 'Admin Dashboard'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>
            Welcome back, {user?.name}!
          </p>
        </div>
        <span style={{
          padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
          background: roleGradient[role], color: 'white',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}>
          {roleLabel[role]}
        </span>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts - only for admin and manager */}
      {role !== 'sales' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FiTrendingUp size={16} color="#667eea" />
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Monthly Leads & Revenue</h3>
              </div>
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
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="leads" stroke="#667eea" fill="url(#leadsGrad)" strokeWidth={2} name="Leads" />
                  <Area type="monotone" dataKey="revenue" stroke="#43e97b" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={card}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>Lead Status</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData.length ? statusData : [{ name: 'No Data', value: 1 }]}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {(statusData.length ? statusData : [{}]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '8px' }}>
                {statusData.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ ...card, marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FiActivity size={16} color="#a78bfa" />
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Monthly Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="leads" fill="#667eea" radius={[6, 6, 0, 0]} name="Leads" />
                <Bar dataKey="revenue" fill="#f093fb" radius={[6, 6, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}

      {/* Sales: simple activity summary */}
      {role === 'sales' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ ...card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FiTrendingUp size={16} color="#43e97b" />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', margin: 0 }}>My Lead Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="myLeadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43e97b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#43e97b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" stroke="#43e97b" fill="url(#myLeadsGrad)" strokeWidth={2} name="My Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* AI Prediction - admin/manager only */}
      {role !== 'sales' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ ...card, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #667eea, #764ba2)', opacity: 0.05 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'white' }}>AI</span>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>AI Sales Prediction</h3>
              <span style={{ fontSize: '11px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '2px 10px', borderRadius: '20px', border: '1px solid rgba(59,130,246,0.3)' }}>Beta</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'Conversion Rate', value: `${data?.conversionRate || 0}%`, color: '#43e97b' },
                { label: 'Predicted Revenue', value: `$${((data?.convertedLeads || 0) * 1200).toLocaleString()}`, color: '#667eea' },
                { label: 'At-Risk Leads', value: data?.totalLeads ? Math.floor(data.totalLeads * 0.15) : 0, color: '#f5576c' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 6px' }}>{label}</p>
                  <p style={{ fontSize: '22px', fontWeight: '700', color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
