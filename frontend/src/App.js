import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import FollowUps from './pages/FollowUps';
import Analytics from './pages/Analytics';
import Employees from './pages/Employees';
import Activities from './pages/Activities';
import Settings from './pages/Settings';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');
  if (loading) return null;
  return (user || token) ? <Navigate to="/" /> : children;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><Layout><Customers /></Layout></PrivateRoute>} />
        <Route path="/leads" element={<PrivateRoute><Layout><Leads /></Layout></PrivateRoute>} />
        <Route path="/followups" element={<PrivateRoute><Layout><FollowUps /></Layout></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Layout><Analytics /></Layout></PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute><Layout><Employees /></Layout></PrivateRoute>} />
        <Route path="/activities" element={<PrivateRoute><Layout><Activities /></Layout></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
