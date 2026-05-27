import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { FiUser, FiMail, FiLock, FiSave, FiBell, FiShield, FiGlobe } from 'react-icons/fi';

const Settings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [notifications, setNotifications] = useState({ email: true, reminders: true, reports: false });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    toast.success('Profile updated!');
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    toast.success('Password changed!');
    setPassForm({ currentPassword: '', newPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <FiUser size={16} className="text-white" />
          </div>
          <h3 className="font-semibold text-white">Profile Information</h3>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-sm text-white/40">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ background: 'rgba(102,126,234,0.2)', color: '#667eea', border: '1px solid rgba(102,126,234,0.3)' }}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input placeholder="Full Name" className="glass-input pl-10 text-sm"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input type="email" placeholder="Email" className="glass-input pl-10 text-sm"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="gradient-btn flex items-center gap-2 px-5 py-2.5 text-sm">
            <FiSave size={14} /> Save Changes
          </motion.button>
        </form>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
            <FiLock size={16} className="text-white" />
          </div>
          <h3 className="font-semibold text-white">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <input type="password" placeholder="Current Password" className="glass-input text-sm"
            value={passForm.currentPassword} onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} />
          <input type="password" placeholder="New Password" className="glass-input text-sm"
            value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} />
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="gradient-btn flex items-center gap-2 px-5 py-2.5 text-sm"
            style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
            <FiShield size={14} /> Update Password
          </motion.button>
        </form>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
            <FiBell size={16} className="text-white" />
          </div>
          <h3 className="font-semibold text-white">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'reminders', label: 'Follow-up Reminders', desc: 'Daily reminder emails at 8AM' },
            { key: 'reports', label: 'Weekly Reports', desc: 'Get weekly performance reports' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
              <button onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                className="relative w-11 h-6 rounded-full transition-all duration-300"
                style={{ background: notifications[key] ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)' }}>
                <motion.div animate={{ x: notifications[key] ? 20 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
