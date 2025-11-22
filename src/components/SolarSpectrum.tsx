import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

export default function SolarSpectrum() {
  const [data, setData] = useState<number[][]>([]);

  useEffect(() => {
    fetch('/bohr-blackbody-solar/solar.csv')
      .then(res => res.text())
      .then(txt => {
        const rows = txt.trim().split('\n').slice(1); // skip header
        const parsed = rows.map(r => r.split(',').map(Number));
        setData(parsed);
      });
  }, []);

  const chartData = {
    labels: data.map(d => d[0]),
    datasets: [
      {
        label: 'Solar Spectrum (Irradiance)',
        data: data.map(d => d[1]),
        borderColor: 'yellow',
        backgroundColor: 'rgba(255,255,0,0.3)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto text-center" style={{ width: '100%', height: '320px' }}>
      <h2 className="text-xl font-semibold mb-2">Solar Spectrum (Sample NASA/NOAA Data)</h2>
      {data.length > 0 ? (
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { title: { display: true, text: 'Wavelength (nm)', color: '#fff' }, ticks: { color: '#fff' } }, y: { title: { display: true, text: 'Irradiance (W/m²/nm)', color: '#fff' }, ticks: { color: '#fff' } } } }} />
      ) : (
        <p>Loading sample spectrum...</p>
      )}
    </div>
  );
}
