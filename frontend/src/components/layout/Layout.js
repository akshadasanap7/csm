import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Layout = ({ children }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 27, 75, 0.95)',
            color: '#fff',
            border: '1px solid rgba(102,126,234,0.3)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6"
      >
        {children}
      </motion.div>
    </main>
  </div>
);

export default Layout;
