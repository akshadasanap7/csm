import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiMail, FiPhone, FiX } from 'react-icons/fi';

const EMPTY = { name: '', email: '', phone: '', company: '', address: '', notes: '' };

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get('/customers');
    setCustomers(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/customers/${editId}`, form); toast.success('Customer updated!'); }
      else { await api.post('/customers', form); toast.success('Customer added!'); }
      setShowModal(false); setForm(EMPTY); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, email: c.email || '', phone: c.phone || '', company: c.company || '', address: c.address || '', notes: c.notes || '' });
    setEditId(c._id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    await api.delete(`/customers/${id}`); toast.success('Deleted!'); load();
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-white/40 text-sm mt-1">{customers.length} total customers</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setForm(EMPTY); setEditId(null); setShowModal(true); }}
          className="gradient-btn flex items-center gap-2 px-4 py-2.5 text-sm">
          <FiPlus size={16} /> Add Customer
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
        <input className="glass-input pl-11" placeholder="Search customers..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-white/20 border-t-blue-400 rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Customer', 'Email', 'Phone', 'Company', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((c, i) => (
                    <motion.tr key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }} className="table-row">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-white">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/50">{c.email}</td>
                      <td className="px-5 py-4 text-sm text-white/50">{c.phone}</td>
                      <td className="px-5 py-4 text-sm text-white/50">{c.company}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEdit(c)}
                            className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors">
                            <FiEdit2 size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(c._id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                            <FiTrash2 size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-16 text-white/30">No customers found</td></tr>
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
                <h3 className="text-lg font-semibold text-white">{editId ? 'Edit' : 'Add'} Customer</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
                  <FiX size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  { f: 'name', icon: FiUser, placeholder: 'Full Name', required: true },
                  { f: 'email', icon: FiMail, placeholder: 'Email' },
                  { f: 'phone', icon: FiPhone, placeholder: 'Phone' },
                ].map(({ f, icon: Icon, placeholder, required }) => (
                  <div key={f} className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                    <input placeholder={placeholder} required={required} className="glass-input pl-10 text-sm"
                      value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
                  </div>
                ))}
                {['company', 'address'].map(f => (
                  <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} className="glass-input text-sm"
                    value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
                ))}
                <textarea placeholder="Notes" rows={2} className="glass-input text-sm resize-none"
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="gradient-btn flex-1 py-2.5 text-sm">Save</motion.button>
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

export default Customers;
