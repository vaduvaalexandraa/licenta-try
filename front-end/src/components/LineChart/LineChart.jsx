import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Numarul de imprumuturi zilnice',
        data: [],
        fill: false,
        backgroundColor: '#b4a7d6',
        borderColor: '#c27ba0',
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'http://localhost:5000/imprumuturi'; // Ensure this is the correct URL
        console.log('API URL:', apiUrl);

        const response = await axios.get(apiUrl);
        console.log('Raw response:', response);

        let loans = response.data;

        if (Array.isArray(loans)) {
          console.log('Fetched loans:', loans);
        } else if (loans.data && Array.isArray(loans.data)) {
          loans = loans.data;
          console.log('Extracted loans from response.data:', loans);
        } else {
          throw new Error('Fetched data is not an array');
        }

        // Generate the list of last 7 days
        const currentDate = new Date();
        const labels = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - i);
          labels.push(date.toLocaleDateString('en-GB'));
        }

        // Count loans per day
        const loanCounts = labels.reduce((acc, label) => {
          const matchingLoans = loans.filter(loan => {
            const loanDate = new Date(loan.dataImprumut).toLocaleDateString('en-GB');
            return loanDate === label;
          });
          acc[label] = matchingLoans.length;
          return acc;
        }, {});

        console.log('Loan counts:', loanCounts);

        // Create data array with counts, filling in missing days with zero
        const data = labels.map(label => loanCounts[label] || 0);

        console.log('Labels:', labels);
        console.log('Data:', data);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Numarul de imprumuturi zilnice',
              data,
              fill: false,
              backgroundColor: '#b4a7d6',
              borderColor: '#c27ba0',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching loan data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '800px', height: '500px', margin: '10px' }}>
      <Line data={chartData} options={{
        scales: {
          x: {
            title: {
              display: true,
              text: 'Data',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Numarul de imprumuturi zilnice',
            },
          },
        },
      }} />
    </div>
  );
};

export default LineChart;
