import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BohrSimulator() {
  const [Z, setZ] = useState(1);
  const [n1, setN1] = useState(3);
  const [n2, setN2] = useState(2);

  const Ei = -13.6 * (Z ** 2) / (n1 ** 2);
  const Ef = -13.6 * (Z ** 2) / (n2 ** 2);
  const deltaE = Ei - Ef;
  const h = 6.626e-34, c = 3e8, e = 1.602e-19;
  const lambda = (h * c) / (deltaE * e) * 1e9;

  const levels = Array.from({ length: 6 }, (_, i) => i + 1);
  const energies = levels.map(n => -13.6 * (Z ** 2) / (n ** 2));

  const chartData = useMemo(() => ({
    labels: levels.map(n => `n=${n}`),
    datasets: [
      {
        label: 'Energy levels (eV)',
        data: energies,
        borderColor: 'cyan',
        tension: 0,
        pointBackgroundColor: 'cyan',
      },
      {
        label: 'Transition',
        data: levels.map(n => (n === n1 || n === n2 ? -13.6 * (Z ** 2) / (n ** 2) : null)),
        borderColor: 'red',
        borderWidth: 2,
        pointBackgroundColor: 'red',
      },
    ],
  }), [Z, n1, n2]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-semibold mb-2">Bohr Model Photon Transitions</h2>
      <div className="flex justify-center gap-2 mb-4">
        <label>Z <input type="number" value={Z} min={1} max={10} onChange={e => setZ(+e.target.value)} className="w-16 text-black" /></label>
        <label>n₁ <input type="number" value={n1} min={1} max={6} onChange={e => setN1(+e.target.value)} className="w-16 text-black" /></label>
        <label>n₂ <input type="number" value={n2} min={1} max={6} onChange={e => setN2(+e.target.value)} className="w-16 text-black" /></label>
      </div>
      <p>λ = {lambda.toFixed(1)} nm, ΔE = {deltaE.toFixed(2)} eV</p>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { y: { beginAtZero: false, ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } } }} />
    </div>
  );
}
