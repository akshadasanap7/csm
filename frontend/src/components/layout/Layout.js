import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main className="flex-1 p-6 overflow-auto">
      <Toaster position="top-right" />
      {children}
    </main>
  </div>
);

export default Layout;
