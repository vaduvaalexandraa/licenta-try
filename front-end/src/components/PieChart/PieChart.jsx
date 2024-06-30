import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';

// Register the plugin
Chart.register(ChartDataLabels);

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
        percentage: [],
      },
    ],
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'http://localhost:5000/carti';
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
        const genreData = genreNames.map(gen => ({
          genre: gen,
          count: genreCounts[gen],
          percentage: parseFloat(genrePercentages[gen]),
        }));

        const backgroundColors = generateColors(genreNames.length);

        setChartData({
          labels: genreData.map(item => item.genre),
          datasets: [
            {
              label: `Numarul de carti: `,
              data: genreData.map(item => item.count),
              backgroundColor: backgroundColors,
              borderColor: backgroundColors,
              borderWidth: 1,
              percentage: genreData.map(item => item.percentage),
            },
          ],
        });

      } catch (error) {
        console.error('Eroare la preluarea cartilor:', error);
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

  const handleDownload = () => {
    const chart = chartRef.current;
    const canvas = chart.canvas;

    //creare canvas nou
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const ctx = newCanvas.getContext('2d');

    //setare fundal alb
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    ctx.drawImage(canvas, 0, 0);

    //descarcare chart
    const link = document.createElement('a');
    link.href = newCanvas.toDataURL('image/png');
    link.download = 'chart.png';
    link.click();
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Distributia cartilor pe Gen Literar',
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
      datalabels: {
        formatter: (value, ctx) => {
          const genre = ctx.chart.data.labels[ctx.dataIndex];
          const percentage = ctx.chart.data.datasets[0].percentage[ctx.dataIndex];
          return [`${genre}`, `${percentage}%`]; //afiseaza genul literar si procentajul
        },
        color: '#6D4C41',
        textAlign: 'center',
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'center',
        align: 'center',
        offset: 0,
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '400px', margin: '10px' }}>
      <Doughnut ref={chartRef} data={chartData} options={options} />
      <button onClick={handleDownload}>Descarca</button>
    </div>
  );
};

export default PieChart;
