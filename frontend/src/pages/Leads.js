import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const card = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '11px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' };

const STATUSES = ['New','Interested','Contacted','Negotiation','Converted','Rejected'];
const STATUS_STYLES = {
  New: { bg: 'rgba(102,126,234,0.2)', color: '#818cf8', border: 'rgba(102,126,234,0.3)' },
  Interested: { bg: 'rgba(240,147,251,0.2)', color: '#f093fb', border: 'rgba(240,147,251,0.3)' },
  Contacted: { bg: 'rgba(79,172,254,0.2)', color: '#4facfe', border: 'rgba(79,172,254,0.3)' },
  Negotiation: { bg: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
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

  const load = async () => { setLoading(true); const res = await api.get('/leads'); setLeads(res.data); setLoading(false); };
  useEffect(() => { load(); api.get('/customers').then(r => setCustomers(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/leads/${editId}`, form); toast.success('Updated!'); }
      else { await api.post('/leads', form); toast.success('Lead created!'); }
      setShowModal(false); setForm(EMPTY); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const handleEdit = (l) => { setForm({ title: l.title, customer: l.customer?._id || '', status: l.status, value: l.value || '', notes: l.notes || '' }); setEditId(l._id); setShowModal(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/leads/${id}`); toast.success('Deleted!'); load(); };
  const filtered = filterStatus === 'All' ? leads : leads.filter(l => l.status === filterStatus);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>Leads</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{leads.length} total leads</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setForm(EMPTY); setEditId(null); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' }}>
          <FiPlus size={16} /> Add Lead
        </motion.button>
      </div>

      {/* Pipeline Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['All', ...STATUSES].map(s => {
          const active = filterStatus === s;
          const style = STATUS_STYLES[s] || {};
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: `1px solid ${active ? (style.border || 'rgba(102,126,234,0.4)') : 'rgba(255,255,255,0.1)'}`, background: active ? (style.bg || 'rgba(102,126,234,0.2)') : 'rgba(255,255,255,0.04)', color: active ? (style.color || '#818cf8') : 'rgba(255,255,255,0.45)', transition: 'all 0.2s' }}>
              {s} {s !== 'All' && `(${leads.filter(l => l.status === s).length})`}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #a78bfa', borderRadius: '50%' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Title', 'Customer', 'Status', 'Value', 'Assigned To', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => {
                  const s = STATUS_STYLES[l.status] || STATUS_STYLES.New;
                  return (
                    <motion.tr key={l._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500', color: 'white' }}>{l.title}</td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{l.customer?.name}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{l.status}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: '600', color: '#43e97b' }}>${l.value?.toLocaleString() || 0}</td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{l.assignedTo?.name}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleEdit(l)}
                            style={{ padding: '7px', borderRadius: '8px', background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.2)', color: '#818cf8', cursor: 'pointer' }}>
                            <FiEdit2 size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(l._id)}
                            style={{ padding: '7px', borderRadius: '8px', background: 'rgba(245,87,108,0.15)', border: '1px solid rgba(245,87,108,0.2)', color: '#f5576c', cursor: 'pointer' }}>
                            <FiTrash2 size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>No leads found</td></tr>}
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
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0 }}>{editId ? 'Edit' : 'Add'} Lead</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                {[{ ph: 'Lead Title', f: 'title', req: true }, { ph: 'Deal Value ($)', f: 'value', type: 'number' }].map(({ ph, f, req, type }) => (
                  <input key={f} type={type || 'text'} placeholder={ph} required={req} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                    style={{ ...inputStyle, marginBottom: '12px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                ))}
                {[{ label: 'customer', opts: customers.map(c => ({ v: c._id, l: c.name })), ph: 'Select Customer' },
                  { label: 'status', opts: STATUSES.map(s => ({ v: s, l: s })), ph: 'Status' }].map(({ label, opts, ph }) => (
                  <select key={label} value={form[label]} onChange={e => setForm({ ...form, [label]: e.target.value })}
                    style={{ ...inputStyle, marginBottom: '12px', cursor: 'pointer', appearance: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}>
                    <option value="" style={{ background: '#1a1a2e' }}>{ph}</option>
                    {opts.map(o => <option key={o.v} value={o.v} style={{ background: '#1a1a2e' }}>{o.l}</option>)}
                  </select>
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

export default Leads;
