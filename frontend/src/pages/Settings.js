import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { FiUser, FiMail, FiLock, FiSave, FiBell, FiShield, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

const card = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '20px',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 16px 12px 42px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  color: 'white',
  fontSize: '14px',
  outline: 'none',
};

const getStrength = (p) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (p.length >= 12) s++;
  return s;
};
const sLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const sColor = ['', '#f5576c', '#f093fb', '#fbbf24', '#43e97b', '#00f2fe'];

const Settings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, reminders: true, reports: false });
  const [profileSaved, setProfileSaved] = useState(false);

  const strength = getStrength(passForm.newPassword);

  const onFocus = e => { e.target.style.borderColor = 'rgba(102,126,234,0.7)'; e.target.style.background = 'rgba(255,255,255,0.1)'; };
  const onBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)'; };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', form);
      setProfileSaved(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (strength < 2) {
      toast.error('Please use a stronger password');
      return;
    }
    try {
      await api.put('/auth/password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to change password');
    }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <div style={{ maxWidth: '680px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>Settings</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Manage your account preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUser size={16} color="white" />
            </div>
            <h3 style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0 }}>Profile Information</h3>
          </div>

          {/* Avatar Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: '0 0 2px' }}>{user?.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '0 0 6px' }}>{user?.email}</p>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(102,126,234,0.2)', color: '#818cf8', border: '1px solid rgba(102,126,234,0.3)', textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave}>
            <div style={{ marginBottom: '14px', position: 'relative' }}>
              <FiUser size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input placeholder="Full Name" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div style={{ marginBottom: '18px', position: 'relative' }}>
              <FiMail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input type="email" placeholder="Email Address" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ padding: '11px 22px', background: profileSaved ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.3s' }}>
              {profileSaved ? <><FiCheck size={14} /> Saved!</> : <><FiSave size={14} /> Save Changes</>}
            </motion.button>
          </form>
        </motion.div>

        {/* Password Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiLock size={16} color="white" />
            </div>
            <h3 style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0 }}>Change Password</h3>
          </div>

          <form onSubmit={handlePasswordSave}>
            {/* Current Password */}
            <div style={{ marginBottom: '14px', position: 'relative' }}>
              <FiLock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input type={showCurr ? 'text' : 'password'} placeholder="Current Password" required
                value={passForm.currentPassword}
                onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                style={{ ...inputStyle, paddingRight: '44px' }} onFocus={onFocus} onBlur={onBlur} />
              <button type="button" onClick={() => setShowCurr(!showCurr)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                {showCurr ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '6px', position: 'relative' }}>
              <FiLock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input type={showNew ? 'text' : 'password'} placeholder="New Password" required
                value={passForm.newPassword}
                onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                style={{ ...inputStyle, paddingRight: '44px' }} onFocus={onFocus} onBlur={onBlur} />
              <button type="button" onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                {showNew ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            {/* Strength Bar */}
            {passForm.newPassword.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength ? sColor[strength] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: sColor[strength] }}>{sLabel[strength]} password</span>
              </div>
            )}

            {/* Confirm Password */}
            <div style={{ marginBottom: '18px', position: 'relative' }}>
              <FiLock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input type="password" placeholder="Confirm New Password" required
                value={passForm.confirmPassword}
                onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                style={{ ...inputStyle, borderColor: passForm.confirmPassword && passForm.confirmPassword !== passForm.newPassword ? '#f5576c' : 'rgba(255,255,255,0.12)' }}
                onFocus={onFocus} onBlur={onBlur} />
              {passForm.confirmPassword && passForm.confirmPassword === passForm.newPassword && (
                <FiCheck size={15} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#43e97b' }} />
              )}
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ padding: '11px 22px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiShield size={14} /> Update Password
            </motion.button>
          </form>
        </motion.div>

        {/* Notifications Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #4facfe, #00f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiBell size={16} color="white" />
            </div>
            <h3 style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0 }}>Notifications</h3>
          </div>

          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'reminders', label: 'Follow-up Reminders', desc: 'Daily reminder emails at 8AM' },
            { key: 'reports', label: 'Weekly Reports', desc: 'Get weekly performance reports' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '10px' }}>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: '500', margin: '0 0 2px' }}>{label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>{desc}</p>
              </div>
              <button onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                style={{ position: 'relative', width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: notifications[key] ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s', flexShrink: 0 }}>
                <motion.div animate={{ x: notifications[key] ? 22 : 2 }} transition={{ type: 'spring', stiffness: 300 }}
                  style={{ position: 'absolute', top: '4px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </button>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Settings;
