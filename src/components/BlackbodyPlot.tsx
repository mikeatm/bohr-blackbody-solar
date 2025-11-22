import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

export default function BlackbodyPlot() {
  const [T, setT] = useState(5778);
  const h = 6.626e-34, c = 3e8, k = 1.381e-23;
  const wavelengths = Array.from({ length: 300 }, (_, i) => 100 + i * 10);
  const intensities = wavelengths.map(l => {
    const L = l * 1e-9;
    return (2 * h * c ** 2) / (L ** 5 * (Math.exp((h * c) / (L * k * T)) - 1));
  });
  const maxI = Math.max(...intensities);

  const chartData = useMemo(() => ({
    labels: wavelengths,
    datasets: [
      {
        label: `Blackbody ${T} K`,
        data: intensities.map(v => v / maxI),
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.3)',
      },
    ],
  }), [T]);

  return (
    <div className="max-w-3xl mx-auto text-center" style={{ width: '100%', height: '320px' }} >
      <h2 className="text-xl font-semibold mb-2">Blackbody Radiation Curve</h2>
      <input type="range" min="1000" max="10000" value={T} onChange={e => setT(+e.target.value)} className="w-1/2" />
      <span className="ml-2">{T} K</span>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { title: { display: true, text: 'Wavelength (nm)', color: '#fff' }, ticks: { color: '#fff' } }, y: { title: { display: true, text: 'Relative Intensity', color: '#fff' }, ticks: { color: '#fff' } } } }} />
    </div>
  );
}

