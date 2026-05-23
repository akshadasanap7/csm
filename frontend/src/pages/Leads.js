import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const STATUSES = ['New','Interested','Contacted','Negotiation','Converted','Rejected'];
const STATUS_COLORS = { New:'bg-blue-100 text-blue-700', Interested:'bg-purple-100 text-purple-700', Contacted:'bg-yellow-100 text-yellow-700', Negotiation:'bg-orange-100 text-orange-700', Converted:'bg-green-100 text-green-700', Rejected:'bg-red-100 text-red-700' };
const EMPTY = { title:'', customer:'', status:'New', value:'', notes:'' };

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const load = () => api.get('/leads').then(r => setLeads(r.data));
  useEffect(() => { load(); api.get('/customers').then(r => setCustomers(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/leads/${editId}`, form); toast.success('Lead updated'); }
      else { await api.post('/leads', form); toast.success('Lead added'); }
      setShowModal(false); setForm(EMPTY); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const handleEdit = (l) => { setForm({ title:l.title, customer:l.customer?._id||'', status:l.status, value:l.value, notes:l.notes||'' }); setEditId(l._id); setShowModal(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/leads/${id}`); toast.success('Deleted'); load(); };

  const filtered = filterStatus === 'All' ? leads : leads.filter(l => l.status === filterStatus);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <FiPlus /> Add Lead
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filterStatus===s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>{s}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>{['Title','Customer','Status','Value','Assigned To','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(l => (
              <tr key={l._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{l.title}</td>
                <td className="px-4 py-3 text-gray-500">{l.customer?.name}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[l.status]}`}>{l.status}</span></td>
                <td className="px-4 py-3 text-gray-500">${l.value?.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{l.assignedTo?.name}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(l)} className="text-blue-500 hover:text-blue-700"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(l._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No leads found</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit' : 'Add'} Lead</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Lead Title" required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.title} onChange={e => setForm({...form,title:e.target.value})} />
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.customer} onChange={e => setForm({...form,customer:e.target.value})}>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="number" placeholder="Deal Value ($)" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.value} onChange={e => setForm({...form,value:e.target.value})} />
              <textarea placeholder="Notes" rows={2} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
