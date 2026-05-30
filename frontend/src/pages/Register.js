import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { FiUser, FiMail, FiLock, FiShield, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

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

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const strength = getStrength(form.password);

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '12px 16px 12px 40px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', color: 'white',
    fontSize: '14px', outline: 'none',
  };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' };
  const onFocus = e => { e.target.style.borderColor = 'rgba(102,126,234,0.7)'; e.target.style.background = 'rgba(255,255,255,0.1)'; };
  const onBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 2) { toast.error('Please use a stronger password'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess(true);
      toast.success('Account created successfully!', { duration: 3000 });
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '16px', position: 'relative', overflow: 'hidden' }}>
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }}
        style={{ position: 'absolute', top: '-150px', right: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,147,251,0.4), transparent)', pointerEvents: 'none' }} />
      <motion.div animate={{ scale: [1.3, 1, 1.3], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,172,254,0.4), transparent)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', padding: '40px', position: 'relative', zIndex: 10 }}>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '30px 0' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #43e97b, #38f9d7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 30px rgba(67,233,123,0.5)' }}>
              <FiCheck size={36} color="white" />
            </motion.div>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '700', margin: '0 0 10px' }}>Account Created Successfully!</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 6px' }}>Your account has been created.</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>Redirecting to login page...</p>
          </motion.div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(240,147,251,0.4)' }}>
                <FiUser size={26} color="white" />
              </motion.div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>Create Account</h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>Join SmartCRM today</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                  <input placeholder="John Doe" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                  <input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                  <input type={showPass ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, number, symbol" required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '44px' }} onFocus={onFocus} onBlur={onBlur} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength ? sColor[strength] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />)}
                    </div>
                    <span style={{ fontSize: '11px', color: sColor[strength] }}>{sLabel[strength]} password</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Role</label>
                <div style={{ position: 'relative' }}>
                  <FiShield size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} onFocus={onFocus} onBlur={onBlur}>
                    <option value="sales" style={{ background: '#1a1a2e' }}>Sales Employee</option>
                    <option value="manager" style={{ background: '#1a1a2e' }}>Manager</option>
                    <option value="admin" style={{ background: '#1a1a2e' }}>Admin</option>
                  </select>
                </div>
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(240,147,251,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} />Creating...</>) : 'Create Account'}
              </motion.button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ padding: '0 12px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
