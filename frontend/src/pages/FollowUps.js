import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiCheck, FiX, FiClock, FiCalendar } from 'react-icons/fi';

const EMPTY = { customer: '', date: '', note: '' };

const FollowUps = () => {
  const [followups, setFollowups] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get('/followups');
    setFollowups(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); api.get('/customers').then(r => setCustomers(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/followups', form);
      toast.success('Follow-up scheduled!');
      setShowModal(false); setForm(EMPTY); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const markComplete = async (id) => {
    await api.put(`/followups/${id}`, { completed: true });
    toast.success('Marked as complete!'); load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/followups/${id}`); toast.success('Deleted!'); load();
  };

  const pending = followups.filter(f => !f.completed);
  const completed = followups.filter(f => f.completed);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Follow-Ups</h1>
          <p className="text-white/40 text-sm mt-1">{pending.length} pending reminders</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="gradient-btn flex items-center gap-2 px-4 py-2.5 text-sm">
          <FiPlus size={16} /> Schedule
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Pending', value: pending.length, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
          { label: 'Completed', value: completed.length, color: '#43e97b', bg: 'rgba(67,233,123,0.1)', border: 'rgba(67,233,123,0.2)' },
        ].map(({ label, value, color, bg, border }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl" style={{ background: bg, border: `1px solid ${border}` }}>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-sm text-white/50 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Pending</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-white/20 border-t-yellow-400 rounded-full" />
          </div>
        ) : pending.length === 0 ? (
          <div className="glass-card p-8 text-center text-white/30">No pending follow-ups 🎉</div>
        ) : (
          <AnimatePresence>
            {pending.map((f, i) => (
              <motion.div key={f._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <FiClock size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{f.customer?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiCalendar size={12} className="text-white/30" />
                      <p className="text-xs text-white/40">{new Date(f.date).toLocaleString()}</p>
                    </div>
                    {f.note && <p className="text-xs text-white/30 mt-0.5">{f.note}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => markComplete(f._id)}
                    className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors">
                    <FiCheck size={16} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(f._id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                    <FiTrash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/30 uppercase tracking-wider">Completed</h3>
          {completed.map((f, i) => (
            <motion.div key={f._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="glass-card p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(67,233,123,0.1)' }}>
                  <FiCheck size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white line-through">{f.customer?.name}</p>
                  <p className="text-xs text-white/30">{new Date(f.date).toLocaleDateString()}</p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(f._id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                <FiTrash2 size={14} />
              </motion.button>
            </motion.div>
          ))}
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
                <h3 className="text-lg font-semibold text-white">Schedule Follow-Up</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/50"><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <select required className="glass-input text-sm cursor-pointer" value={form.customer}
                  onChange={e => setForm({ ...form, customer: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <option value="" style={{ background: '#1a1a2e' }}>Select Customer</option>
                  {customers.map(c => <option key={c._id} value={c._id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
                </select>
                <input type="datetime-local" required className="glass-input text-sm"
                  value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <textarea placeholder="Note" rows={3} className="glass-input text-sm resize-none"
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} className="gradient-btn flex-1 py-2.5 text-sm">Schedule</motion.button>
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

export default FollowUps;
