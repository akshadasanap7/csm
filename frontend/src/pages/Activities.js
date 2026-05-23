import { useEffect, useState } from 'react';
import api from '../api/axios';

const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => { api.get('/activities').then(r => setActivities(r.data)); }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Activity Log</h2>
      <div className="bg-white rounded-xl shadow-sm divide-y">
        {activities.map(a => (
          <div key={a._id} className="px-5 py-4 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {a.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-800"><span className="font-medium">{a.user?.name}</span> {a.action}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && <p className="text-center py-8 text-gray-400">No activities yet</p>}
      </div>
    </div>
  );
};

export default Activities;
