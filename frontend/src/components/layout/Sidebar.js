import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiUsers, FiTrendingUp, FiBell, FiBarChart2,
  FiLogOut, FiSettings, FiUserPlus, FiActivity, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: FiHome },
  { path: '/customers', label: 'Customers', icon: FiUsers },
  { path: '/leads', label: 'Leads', icon: FiTrendingUp },
  { path: '/followups', label: 'Follow-Ups', icon: FiBell },
  { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { path: '/employees', label: 'Employees', icon: FiUserPlus },
  { path: '/activities', label: 'Activities', icon: FiActivity },
  { path: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        background: 'rgba(10,8,30,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh', flexShrink: 0, overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SmartCRM
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', textTransform: 'capitalize' }}>{user?.role}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: collapsed ? 'auto' : '0' }}>
          {collapsed ? <FiMenu size={16} /> : <FiX size={16} />}
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ margin: '12px', padding: '12px', borderRadius: '14px', background: 'rgba(102,126,234,0.1)', border: '1px solid rgba(102,126,234,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', marginTop: '4px' }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link key={path} to={path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '12px', marginBottom: '2px',
                background: active ? 'rgba(102,126,234,0.2)' : 'transparent',
                border: active ? '1px solid rgba(102,126,234,0.25)' : '1px solid transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.5)',
                fontSize: '13px', fontWeight: active ? '600' : '400',
                cursor: 'pointer', transition: 'all 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
              >
                <Icon size={17} color={active ? '#818cf8' : 'currentColor'} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          margin: '8px', padding: '11px 14px', borderRadius: '12px',
          background: 'none', border: '1px solid transparent',
          color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer',
          transition: 'all 0.2s', justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,87,108,0.1)'; e.currentTarget.style.color = '#f5576c'; e.currentTarget.style.borderColor = 'rgba(245,87,108,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'transparent'; }}
      >
        <FiLogOut size={17} style={{ flexShrink: 0 }} />
        <AnimatePresence>
          {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Logout</motion.span>}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
};

export default Sidebar;
