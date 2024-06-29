import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import 'chartjs-plugin-datalabels';
import * as ChartJS from 'chart.js/auto'; // Folosește 'chart.js/auto' în loc de 'chart.js' pentru a evita problemele de export

const PieChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Număr de Cărți pe Gen Literar',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'http://localhost:5000/carti'; // Modifică cu URL-ul corect al backend-ului
        const response = await axios.get(apiUrl);
        const carti = response.data;

        if (!carti || !Array.isArray(carti)) {
          console.error('Format de răspuns nevalid:', carti);
          return;
        }

        const totalBooks = carti.length;
        const genreCounts = {};
        const genrePercentages = {};

        carti.forEach(carte => {
          const genLiterar = carte.genLiterar;
          if (genLiterar) {
            if (genreCounts[genLiterar]) {
              genreCounts[genLiterar]++;
            } else {
              genreCounts[genLiterar] = 1;
            }
          }
        });

        Object.keys(genreCounts).forEach(gen => {
          genrePercentages[gen] = ((genreCounts[gen] / totalBooks) * 100).toFixed(2);
        });

        const genreNames = Object.keys(genreCounts);
        const genreData = genreNames.map(gen => {
          return {
            genre: gen,
            count: genreCounts[gen],
            percentage: parseFloat(genrePercentages[gen]),
          };
        });

        const backgroundColors = generateColors(genreNames.length);

        setChartData({
          labels: genreData.map(item => item.genre),
          datasets: [
            {
              label: 'Număr de Cărți pe Gen Literar',
              data: genreData.map(item => item.count), // Keep the count data
              percentage: genreData.map(item => item.percentage), // Include percentage data
              backgroundColor: backgroundColors,
              borderColor: backgroundColors,
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error('Eroare la preluarea cărților:', error);
      }
    };

    fetchData();
  }, []);

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
    }
    return colors;
  };

  const options = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          // Access the percentage data for the current dataIndex
          const percentage = ctx.chart.data.datasets[0].percentage[ctx.dataIndex];
          return `${label}: ${percentage}%`;
        },
        color: '#6D4C41',
        textAlign: 'center',
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'end',
        align: 'start',
        offset: 15,
        clamp: true,
        listeners: {
          outside: function(context) {
            const arc = context.chart.chartArea;
            const offset = (arc.bottom - arc.top) / 2;
            return {
              y: arc.top + offset
            };
          }
        }
      }
    }
  };
  
  return (
    <div style={{ maxWidth: '600px', maxHeight: '600px', margin: '20px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
