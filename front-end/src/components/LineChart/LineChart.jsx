import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  });

  const handleDataChange = (event) => {
    const newData = event.target.value.split(',').map(Number);
    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: newData,
        },
      ],
    });
  };

  return (
    <div style={{ maxWidth: '600px', maxHeight: '600px', margin: '20px' }}>
      <Line data={chartData} />
      <div>
        <label htmlFor="data-input">Input Data (comma separated): </label>
        <input
          id="data-input"
          type="text"
          onChange={handleDataChange}
          placeholder="65, 59, 80, 81, 56, 55, 40"
        />
      </div>
    </div>
  );
};

export default LineChart;