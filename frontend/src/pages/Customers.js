import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiMail, FiPhone, FiX } from 'react-icons/fi';

const card = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '11px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' };
const EMPTY = { name: '', email: '', phone: '', company: '', address: '', notes: '' };

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const res = await api.get('/customers'); setCustomers(res.data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/customers/${editId}`, form); toast.success('Updated!'); }
      else { await api.post('/customers', form); toast.success('Customer added!'); }
      setShowModal(false); setForm(EMPTY); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const handleEdit = (c) => { setForm({ name: c.name, email: c.email || '', phone: c.phone || '', company: c.company || '', address: c.address || '', notes: c.notes || '' }); setEditId(c._id); setShowModal(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/customers/${id}`); toast.success('Deleted!'); load(); };
  const filtered = customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>Customers</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{customers.length} total customers</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setForm(EMPTY); setEditId(null); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' }}>
          <FiPlus size={16} /> Add Customer
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
        <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: '42px' }}
          onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #667eea', borderRadius: '50%' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Customer', 'Email', 'Phone', 'Company', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{c.email}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{c.phone}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{c.company}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEdit(c)}
                          style={{ padding: '7px', borderRadius: '8px', background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.2)', color: '#818cf8', cursor: 'pointer' }}>
                          <FiEdit2 size={14} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(c._id)}
                          style={{ padding: '7px', borderRadius: '8px', background: 'rgba(245,87,108,0.15)', border: '1px solid rgba(245,87,108,0.2)', color: '#f5576c', cursor: 'pointer' }}>
                          <FiTrash2 size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ ...card, padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0 }}>{editId ? 'Edit' : 'Add'} Customer</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                {[{ f: 'name', icon: FiUser, ph: 'Full Name', req: true }, { f: 'email', icon: FiMail, ph: 'Email' }, { f: 'phone', icon: FiPhone, ph: 'Phone' }].map(({ f, icon: Icon, ph, req }) => (
                  <div key={f} style={{ position: 'relative', marginBottom: '12px' }}>
                    <Icon size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                    <input placeholder={ph} required={req} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: '40px' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                ))}
                {['company', 'address'].map(f => (
                  <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                    style={{ ...inputStyle, marginBottom: '12px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                ))}
                <textarea placeholder="Notes" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ ...inputStyle, resize: 'none', marginBottom: '20px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save</motion.button>
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

export default Customers;
