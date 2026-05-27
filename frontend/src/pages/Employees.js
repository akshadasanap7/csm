import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUser, FiMail, FiShield } from 'react-icons/fi';

const ROLE_STYLES = {
  admin: { bg: 'rgba(245,87,108,0.15)', color: '#f5576c', border: 'rgba(245,87,108,0.3)' },
  manager: { bg: 'rgba(102,126,234,0.15)', color: '#667eea', border: 'rgba(102,126,234,0.3)' },
  sales: { bg: 'rgba(67,233,123,0.15)', color: '#43e97b', border: 'rgba(67,233,123,0.3)' },
};

const EMPTY = { name: '', email: '', password: '', role: 'sales' };

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setEmployees(res.data);
    } catch {
      // fallback dummy data
      setEmployees([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      toast.success('Employee added!');
      setShowModal(false); setForm(EMPTY); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-white/40 text-sm mt-1">{employees.length} team members</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="gradient-btn flex items-center gap-2 px-4 py-2.5 text-sm">
          <FiPlus size={16} /> Add Employee
        </motion.button>
      </motion.div>

      {/* Role Stats */}
      <div className="grid grid-cols-3 gap-4">
        {['admin', 'manager', 'sales'].map(role => {
          const count = employees.filter(e => e.role === role).length;
          const style = ROLE_STYLES[role];
          return (
            <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl text-center"
              style={{ background: style.bg, border: `1px solid ${style.border}` }}>
              <p className="text-2xl font-bold" style={{ color: style.color }}>{count}</p>
              <p className="text-xs text-white/50 mt-1 capitalize">{role}s</p>
            </motion.div>
          );
        })}
      </div>

      {/* Employee Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-white/20 border-t-blue-400 rounded-full" />
        </div>
      ) : employees.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiUser size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/30">No employees yet. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp, i) => {
            const style = ROLE_STYLES[emp.role] || ROLE_STYLES.sales;
            return (
              <motion.div key={emp._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} className="glass-card p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    {emp.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{emp.name}</p>
                    <p className="text-xs text-white/40">{emp.email}</p>
                  </div>
                </div>
                <span className="badge text-xs" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                  {emp.role}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Add Employee</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/50"><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                  <input placeholder="Full Name" required className="glass-input pl-10 text-sm"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                  <input type="email" placeholder="Email" required className="glass-input pl-10 text-sm"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <input type="password" placeholder="Password" required className="glass-input text-sm"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                  <select className="glass-input pl-10 text-sm cursor-pointer" value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <option value="sales" style={{ background: '#1a1a2e' }}>Sales Employee</option>
                    <option value="manager" style={{ background: '#1a1a2e' }}>Manager</option>
                    <option value="admin" style={{ background: '#1a1a2e' }}>Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} className="gradient-btn flex-1 py-2.5 text-sm">Add</motion.button>
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 text-sm rounded-xl border border-white/10 text-white/60 hover:bg-white/5">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;
