import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FiActivity, FiUser } from 'react-icons/fi';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activities').then(r => { setActivities(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const GRADIENT_COLORS = ['linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)', 'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-white/40 text-sm mt-1">Recent team activities</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-white/20 border-t-blue-400 rounded-full" />
        </div>
      ) : activities.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiActivity size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/30">No activities yet</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-white/5">
            {activities.map((a, i) => (
              <motion.div key={a._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: GRADIENT_COLORS[i % GRADIENT_COLORS.length] }}>
                  {a.user?.name?.charAt(0).toUpperCase() || <FiUser size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium text-blue-400">{a.user?.name}</span>
                    {' '}{a.action}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
                <span className="text-xs text-white/20 flex-shrink-0">{a.entity}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
