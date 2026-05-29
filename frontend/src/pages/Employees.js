import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiUser, FiMail, FiShield, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const card = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '11px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' };
const ROLE_STYLES = {
  admin: { bg: 'rgba(245,87,108,0.15)', color: '#f5576c', border: 'rgba(245,87,108,0.3)' },
  manager: { bg: 'rgba(102,126,234,0.15)', color: '#818cf8', border: 'rgba(102,126,234,0.3)' },
  sales: { bg: 'rgba(67,233,123,0.15)', color: '#43e97b', border: 'rgba(67,233,123,0.3)' },
};
const EMPTY = { name: '', email: '', password: '', role: 'sales' };

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const res = await api.get('/auth/users'); setEmployees(res.data); } catch { setEmployees([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/auth/register', form); toast.success('Employee added!'); setShowModal(false); setForm(EMPTY); load(); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try { await api.delete(`/auth/users/${id}`); toast.success('Deleted!'); load(); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>Employees</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{employees.length} team members</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)}
          style={{ display: user?.role === 'admin' ? 'flex' : 'none', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' }}>
          <FiPlus size={16} /> Add Employee
        </motion.button>
      </div>

      {/* Role Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {['admin', 'manager', 'sales'].map(role => {
          const count = employees.filter(e => e.role === role).length;
          const s = ROLE_STYLES[role];
          return (
            <div key={role} style={{ padding: '20px', borderRadius: '16px', background: s.bg, border: `1px solid ${s.border}`, textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: '700', color: s.color, margin: 0 }}>{count}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '4px', textTransform: 'capitalize' }}>{role}s</p>
            </div>
          );
        })}
      </div>

      {/* Employee Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #667eea', borderRadius: '50%' }} />
        </div>
      ) : employees.length === 0 ? (
        <div style={{ ...card, padding: '60px', textAlign: 'center' }}>
          <FiUser size={40} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>No employees yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {employees.map((emp, i) => {
            const s = ROLE_STYLES[emp.role] || ROLE_STYLES.sales;
            return (
              <motion.div key={emp._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ ...card, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                    {emp.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email}</p>
                  </div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s.bg, color: s.color, border: `1px solid ${s.border}`, textTransform: 'capitalize' }}>
                  {emp.role}
                </span>
                {user?.role === 'admin' && emp._id !== user?._id && (
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(emp._id)}
                    style={{ marginTop: '12px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(245,87,108,0.15)', border: '1px solid rgba(245,87,108,0.2)', color: '#f5576c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <FiTrash2 size={12} /> Remove
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ ...card, padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0 }}>Add Employee</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                {[{ f: 'name', icon: FiUser, ph: 'Full Name' }, { f: 'email', icon: FiMail, ph: 'Email', type: 'email' }, { f: 'password', icon: null, ph: 'Password', type: 'password' }].map(({ f, icon: Icon, ph, type }) => (
                  <div key={f} style={{ position: 'relative', marginBottom: '12px' }}>
                    {Icon && <Icon size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />}
                    <input type={type || 'text'} placeholder={ph} required value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: Icon ? '40px' : '16px' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                ))}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <FiShield size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '40px', cursor: 'pointer', appearance: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}>
                    <option value="sales" style={{ background: '#1a1a2e' }}>Sales Employee</option>
                    <option value="manager" style={{ background: '#1a1a2e' }}>Manager</option>
                    <option value="admin" style={{ background: '#1a1a2e' }}>Admin</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Add</motion.button>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
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
