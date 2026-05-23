import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Reports = () => {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/reports/dashboard').then(r => setData(r.data)); }, []);

  if (!data) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  const revenueData = {
    labels: data.revenueByMonth.map(m => MONTHS[m._id - 1]),
    datasets: [{ label: 'Revenue ($)', data: data.revenueByMonth.map(m => m.revenue), backgroundColor: '#10b981' }],
  };

  const statusData = {
    labels: data.leadsByStatus.map(s => s._id),
    datasets: [{ data: data.leadsByStatus.map(s => s.count), backgroundColor: ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#6b7280'] }],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: data.totalCustomers },
          { label: 'Total Leads', value: data.totalLeads },
          { label: 'Conversion Rate', value: `${data.conversionRate}%` },
          { label: 'Sales Employees', value: data.totalEmployees },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-600">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Monthly Revenue</h3>
          <Bar data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Lead Status Distribution</h3>
          <Pie data={statusData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
