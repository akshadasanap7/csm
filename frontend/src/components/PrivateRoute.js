import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontSize: '16px'
    }}>
      Loading...
    </div>
  );

  return (user || token) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
