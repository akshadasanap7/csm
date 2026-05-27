import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiCheck, FiX, FiClock, FiCalendar } from 'react-icons/fi';

const card = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '11px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' };
const EMPTY = { customer: '', date: '', note: '' };

const FollowUps = () => {
  const [followups, setFollowups] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const res = await api.get('/followups'); setFollowups(res.data); setLoading(false); };
  useEffect(() => { load(); api.get('/customers').then(r => setCustomers(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/followups', form); toast.success('Scheduled!'); setShowModal(false); setForm(EMPTY); load(); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const markComplete = async (id) => { await api.put(`/followups/${id}`, { completed: true }); toast.success('Completed!'); load(); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/followups/${id}`); toast.success('Deleted!'); load(); };

  const pending = followups.filter(f => !f.completed);
  const completed = followups.filter(f => f.completed);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>Follow-Ups</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{pending.length} pending reminders</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' }}>
          <FiPlus size={16} /> Schedule
        </motion.button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Pending', value: pending.length, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
          { label: 'Completed', value: completed.length, color: '#43e97b', bg: 'rgba(67,233,123,0.1)', border: 'rgba(67,233,123,0.2)' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{ padding: '20px', borderRadius: '16px', background: bg, border: `1px solid ${border}` }}>
            <p style={{ fontSize: '32px', fontWeight: '700', color, margin: 0 }}>{value}</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Pending */}
      <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Pending</h3>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #fbbf24', borderRadius: '50%' }} />
        </div>
      ) : pending.length === 0 ? (
        <div style={{ ...card, padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', marginBottom: '24px' }}>🎉 No pending follow-ups!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <AnimatePresence>
            {pending.map((f, i) => (
              <motion.div key={f._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                style={{ ...card, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiClock size={18} color="#fbbf24" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>{f.customer?.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <FiCalendar size={12} color="rgba(255,255,255,0.3)" />
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{new Date(f.date).toLocaleString()}</p>
                    </div>
                    {f.note && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', margin: '2px 0 0' }}>{f.note}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => markComplete(f._id)}
                    style={{ padding: '8px', borderRadius: '10px', background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.2)', color: '#43e97b', cursor: 'pointer' }}>
                    <FiCheck size={15} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(f._id)}
                    style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245,87,108,0.15)', border: '1px solid rgba(245,87,108,0.2)', color: '#f5576c', cursor: 'pointer' }}>
                    <FiTrash2 size={15} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Completed</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {completed.map((f, i) => (
              <motion.div key={f._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                style={{ ...card, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(67,233,123,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiCheck size={16} color="#43e97b" />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'white', textDecoration: 'line-through', margin: 0 }}>{f.customer?.name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>{new Date(f.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(f._id)}
                  style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245,87,108,0.1)', border: 'none', color: '#f5576c', cursor: 'pointer' }}>
                  <FiTrash2 size={13} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </>
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
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0 }}>Schedule Follow-Up</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <select required value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '12px', cursor: 'pointer', appearance: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}>
                  <option value="" style={{ background: '#1a1a2e' }}>Select Customer</option>
                  {customers.map(c => <option key={c._id} value={c._id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
                </select>
                <input type="datetime-local" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '12px', colorScheme: 'dark' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                <textarea placeholder="Note" rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                  style={{ ...inputStyle, resize: 'none', marginBottom: '20px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Schedule</motion.button>
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

export default FollowUps;
