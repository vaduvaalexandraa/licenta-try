import React from 'react';
import LineChart from '../LineChart/LineChart';
import PieChart from '../PieChart/PieChart';

function AdminDashboard() {
    return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '600px', maxHeight: '600px', margin: '20px' }}>
          <LineChart />
        </div>
        <div style={{ maxWidth: '600px', maxHeight: '600px', margin: '20px' }}>
          <PieChart />
        </div>
      </div>
    </div>
    );
}

export default AdminDashboard;