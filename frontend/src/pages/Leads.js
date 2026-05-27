import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const STATUSES = ['New','Interested','Contacted','Negotiation','Converted','Rejected'];
const STATUS_STYLES = {
  New: { bg: 'rgba(102,126,234,0.2)', color: '#667eea', border: 'rgba(102,126,234,0.3)' },
  Interested: { bg: 'rgba(240,147,251,0.2)', color: '#f093fb', border: 'rgba(240,147,251,0.3)' },
  Contacted: { bg: 'rgba(79,172,254,0.2)', color: '#4facfe', border: 'rgba(79,172,254,0.3)' },
  Negotiation: { bg: 'rgba(245,245,0,0.15)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Converted: { bg: 'rgba(67,233,123,0.2)', color: '#43e97b', border: 'rgba(67,233,123,0.3)' },
  Rejected: { bg: 'rgba(245,87,108,0.2)', color: '#f5576c', border: 'rgba(245,87,108,0.3)' },
};
const EMPTY = { title: '', customer: '', status: 'New', value: '', notes: '' };

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get('/leads');
    setLeads(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); api.get('/customers').then(r => setCustomers(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/leads/${editId}`, form); toast.success('Lead updated!'); }
      else { await api.post('/leads', form); toast.success('Lead created!'); }
      setShowModal(false); setForm(EMPTY); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const handleEdit = (l) => {
    setForm({ title: l.title, customer: l.customer?._id || '', status: l.status, value: l.value || '', notes: l.notes || '' });
    setEditId(l._id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/leads/${id}`); toast.success('Deleted!'); load();
  };

  const filtered = filterStatus === 'All' ? leads : leads.filter(l => l.status === filterStatus);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-white/40 text-sm mt-1">{leads.length} total leads</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setForm(EMPTY); setEditId(null); setShowModal(true); }}
          className="gradient-btn flex items-center gap-2 px-4 py-2.5 text-sm">
          <FiPlus size={16} /> Add Lead
        </motion.button>
      </motion.div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STATUSES.map((s, i) => {
          const count = leads.filter(l => l.status === s).length;
          const style = STATUS_STYLES[s];
          return (
            <motion.button key={s} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}
              className="p-3 rounded-xl text-center transition-all"
              style={{
                background: filterStatus === s ? style.bg : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filterStatus === s ? style.border : 'rgba(255,255,255,0.08)'}`,
              }}>
              <p className="text-lg font-bold" style={{ color: style.color }}>{count}</p>
              <p className="text-xs text-white/40 mt-0.5">{s}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-white/20 border-t-purple-400 rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Title', 'Customer', 'Status', 'Value', 'Assigned To', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => {
                  const style = STATUS_STYLES[l.status] || STATUS_STYLES.New;
                  return (
                    <motion.tr key={l._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }} className="table-row">
                      <td className="px-5 py-4 text-sm font-medium text-white">{l.title}</td>
                      <td className="px-5 py-4 text-sm text-white/50">{l.customer?.name}</td>
                      <td className="px-5 py-4">
                        <span className="badge" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium" style={{ color: '#43e97b' }}>
                        ${l.value?.toLocaleString() || 0}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/50">{l.assignedTo?.name}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEdit(l)}
                            className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400"><FiEdit2 size={14} /></motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(l._id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><FiTrash2 size={14} /></motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-white/30">No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

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
                <h3 className="text-lg font-semibold text-white">{editId ? 'Edit' : 'Add'} Lead</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/50"><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input placeholder="Lead Title" required className="glass-input text-sm"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <select className="glass-input text-sm cursor-pointer" value={form.customer}
                  onChange={e => setForm({ ...form, customer: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <option value="" style={{ background: '#1a1a2e' }}>Select Customer</option>
                  {customers.map(c => <option key={c._id} value={c._id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
                </select>
                <select className="glass-input text-sm cursor-pointer" value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1a2e' }}>{s}</option>)}
                </select>
                <input type="number" placeholder="Deal Value ($)" className="glass-input text-sm"
                  value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                <textarea placeholder="Notes" rows={2} className="glass-input text-sm resize-none"
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} className="gradient-btn flex-1 py-2.5 text-sm">Save</motion.button>
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

export default Leads;
