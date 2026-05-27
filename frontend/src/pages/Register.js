import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(240,147,251,0.3), transparent)' }} />
        <motion.div animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(79,172,254,0.3), transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
              <FiUser size={24} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-white/50 text-sm mt-1">Join SmartCRM today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', icon: FiUser, placeholder: 'Full Name', type: 'text' },
              { field: 'email', icon: FiMail, placeholder: 'Email Address', type: 'email' },
              { field: 'password', icon: FiLock, placeholder: 'Password', type: 'password' },
            ].map(({ field, icon: Icon, placeholder, type }) => (
              <div key={field} className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input type={type} placeholder={placeholder} required
                  className="glass-input pl-11"
                  value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
              </div>
            ))}

            <div className="relative">
              <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <select className="glass-input pl-11 cursor-pointer"
                value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                <option value="sales" style={{ background: '#1a1a2e' }}>Sales Employee</option>
                <option value="manager" style={{ background: '#1a1a2e' }}>Manager</option>
                <option value="admin" style={{ background: '#1a1a2e' }}>Admin</option>
              </select>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="gradient-btn w-full py-3 text-sm mt-2"
              style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
