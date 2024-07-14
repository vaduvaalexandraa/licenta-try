import React, { useState, useEffect, useRef } from 'react';
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

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'http://localhost:5000/imprumuturi'; 
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

        //generam ultimele 7 zile
        const currentDate = new Date();
        const labels = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - i);
          labels.push(date.toLocaleDateString('en-GB'));
        }

        // numaram imprumuturile pentru fiecare zi
        const loanCounts = labels.reduce((acc, label) => {
          const matchingLoans = loans.filter(loan => {
            const loanDate = new Date(loan.dataImprumut).toLocaleDateString('en-GB');
            return loanDate === label;
          });
          acc[label] = matchingLoans.length;
          return acc;
        }, {});

        console.log('Loan counts:', loanCounts);

        
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

  const handleDownload = () => {
    const chart = chartRef.current;
    const canvas = chart.canvas;

    // cream un canvas pentru a putea descarca imaginea
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const ctx = newCanvas.getContext('2d');


    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);


    ctx.drawImage(canvas, 0, 0);


    const link = document.createElement('a');
    link.href = newCanvas.toDataURL('image/png');
    link.download = 'line_chart.png';
    link.click();
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Numarul de imprumuturi zilnice pe ultimele 7 zile',
        font: {
          size: 20,
        },
        padding: {
          top: 10,
          bottom: 30,
        }
      },
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      datalabels: {
        display: false, 
      },
    },
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
          text: 'Nr de imprumuturi zilnice',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', height: '500px', margin: '10px' }}>
      <Line ref={chartRef} data={chartData} options={options} />
      <button style={{height:'30px', color: 'black', borderRadius: '5px'}} onClick={handleDownload}>Descarca</button>
    </div>
  );
};

export default LineChart;
