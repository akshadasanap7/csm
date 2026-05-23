import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUsers, FiTrendingUp, FiBell, FiActivity, FiBarChart2, FiLogOut } from 'react-icons/fi';

const navItems = [
  { path: '/', label: 'Dashboard', icon: FiHome },
  { path: '/customers', label: 'Customers', icon: FiUsers },
  { path: '/leads', label: 'Leads', icon: FiTrendingUp },
  { path: '/followups', label: 'Follow-Ups', icon: FiBell },
  { path: '/activities', label: 'Activities', icon: FiActivity },
  { path: '/reports', label: 'Reports', icon: FiBarChart2 },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">SmartCRM</h1>
        <p className="text-xs text-gray-400 mt-1">{user?.name} · {user?.role}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon size={16} /> {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-8 py-4 text-sm text-gray-400 hover:text-white border-t border-gray-700"
      >
        <FiLogOut size={16} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
