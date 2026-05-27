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
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{
        background: 'rgba(15, 12, 41, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SmartCRM
              </h1>
              <p className="text-xs text-white/40 mt-0.5">{user?.role}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <FiMenu size={18} /> : <FiX size={18} />}
        </button>
      </div>

      {/* User Avatar */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-4 mt-4 p-3 rounded-xl"
          style={{ background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/40">{user?.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 mt-4">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link key={path} to={path} className={`sidebar-link ${active ? 'active' : ''}`}>
              <Icon size={18} className={active ? 'text-blue-400' : ''} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mx-3 mb-4 p-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm"
      >
        <FiLogOut size={18} />
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
};

export default Sidebar;
