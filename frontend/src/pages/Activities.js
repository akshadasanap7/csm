import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FiActivity, FiUser } from 'react-icons/fi';

const card = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' };
const GRADIENTS = ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)', 'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)'];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activities').then(r => { setActivities(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: 0 }}>Activity Log</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Recent team activities</p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #667eea', borderRadius: '50%' }} />
        </div>
      ) : activities.length === 0 ? (
        <div style={{ ...card, padding: '60px', textAlign: 'center' }}>
          <FiActivity size={40} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>No activities yet</p>
        </div>
      ) : (
        <div style={{ ...card, overflow: 'hidden' }}>
          {activities.map((a, i) => (
            <motion.div key={a._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 20px', borderBottom: i < activities.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: GRADIENTS[i % GRADIENTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                {a.user?.name?.charAt(0).toUpperCase() || <FiUser size={14} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: 'white', margin: 0 }}>
                  <span style={{ fontWeight: '600', color: '#818cf8' }}>{a.user?.name}</span> {a.action}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>{new Date(a.createdAt).toLocaleString()}</p>
              </div>
              {a.entity && (
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '20px', flexShrink: 0 }}>{a.entity}</span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
