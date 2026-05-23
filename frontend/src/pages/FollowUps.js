import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

const EMPTY = { customer: '', date: '', note: '' };

const FollowUps = () => {
  const [followups, setFollowups] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => api.get('/followups').then(r => setFollowups(r.data));
  useEffect(() => { load(); api.get('/customers').then(r => setCustomers(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/followups/${editId}`, form); toast.success('Updated'); }
      else { await api.post('/followups', form); toast.success('Follow-up scheduled'); }
      setShowModal(false); setForm(EMPTY); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const markComplete = async (id) => {
    await api.put(`/followups/${id}`, { completed: true });
    toast.success('Marked complete'); load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/followups/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Follow-Ups</h2>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <FiPlus /> Schedule Follow-Up
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>{['Customer','Date','Note','Assigned To','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {followups.map(f => (
              <tr key={f._id} className={`hover:bg-gray-50 ${f.completed ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-medium">{f.customer?.name}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(f.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-500">{f.note}</td>
                <td className="px-4 py-3 text-gray-500">{f.assignedTo?.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${f.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {f.completed ? 'Done' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {!f.completed && <button onClick={() => markComplete(f._id)} className="text-green-500 hover:text-green-700"><FiCheck /></button>}
                  <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {followups.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No follow-ups scheduled</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Schedule Follow-Up</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.customer} onChange={e => setForm({...form,customer:e.target.value})}>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input type="datetime-local" required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.date} onChange={e => setForm({...form,date:e.target.value})} />
              <textarea placeholder="Note" rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.note} onChange={e => setForm({...form,note:e.target.value})} />
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

export default FollowUps;
