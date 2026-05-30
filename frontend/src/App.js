import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
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
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

const AppRoutes = () => (
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
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(30,27,75,0.98)',
            color: '#fff',
            border: '1px solid rgba(102,126,234,0.4)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#43e97b', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f5576c', secondary: '#fff' } },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
