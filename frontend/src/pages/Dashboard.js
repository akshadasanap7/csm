import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, LineElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/reports/dashboard').then(r => setData(r.data)); }, []);

  if (!data) return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;

  const monthlyData = {
    labels: data.monthlyLeads.map(m => MONTHS[m._id - 1]),
    datasets: [{ label: 'Leads', data: data.monthlyLeads.map(m => m.count), backgroundColor: '#3b82f6' }],
  };

  const statusData = {
    labels: data.leadsByStatus.map(s => s._id),
    datasets: [{ data: data.leadsByStatus.map(s => s.count), backgroundColor: ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#6b7280'] }],
  };

  const revenueData = {
    labels: data.revenueByMonth.map(m => MONTHS[m._id - 1]),
    datasets: [{ label: 'Revenue ($)', data: data.revenueByMonth.map(m => m.revenue), borderColor: '#10b981', tension: 0.4, fill: false }],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Customers" value={data.totalCustomers} color="border-blue-500" />
        <StatCard label="Total Leads" value={data.totalLeads} color="border-purple-500" />
        <StatCard label="Converted Leads" value={data.convertedLeads} color="border-green-500" />
        <StatCard label="Pending Follow-Ups" value={data.pendingFollowups} color="border-yellow-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Monthly Leads</h3>
          <Bar data={monthlyData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Leads by Status</h3>
          <Pie data={statusData} />
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Revenue Trend</h3>
        <Line data={revenueData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Dashboard;
