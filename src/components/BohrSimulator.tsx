import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BohrSimulator = () => {
  const canvasRef = useRef(null);
  const [Z, setZ] = useState(1);
  const [n1, setN1] = useState(3);
  const [n2, setN2] = useState(2);

  const levels = Array.from({ length: 6 }, (_, i) => i + 1);
  const y = levels.map((n) => -13.6 * (Z * Z) / (n * n));

  const Ei = -13.6 * Z * Z / (n1 * n1);
  const Ef = -13.6 * Z * Z / (n2 * n2);
  const deltaE = Ei - Ef;
  const h = 6.626e-34;
  const c = 3e8;
  const e = 1.602e-19;
  const lambda = (h * c) / (deltaE * e) * 1e9;

  const series = {
    Lyman: { n1: 1, color: 'purple' },
    Balmer: { n1: 2, color: 'blue' },
    Paschen: { n1: 3, color: 'green' },
    Pfund: { n1: 5, color: 'orange' },
  };

  const seriesLines = Object.entries(series).map(([name, s]) => {
    const n2 = s.n1 + 1;
    const E1 = -13.6 * Z * Z / (s.n1 * s.n1);
    const E2 = -13.6 * Z * Z / (n2 * n2);
    return { name, n1: s.n1, E1, E2, color: s.color };
  });

  const data = {
    labels: levels.map((n) => n.toString()),
    datasets: [
      {
        label: 'Energy Levels',
        data: y,
        borderColor: 'cyan',
        backgroundColor: 'cyan',
        pointRadius: 5,
        tension: 0,
        showLine: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: 'Energy (eV)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      x: {
        title: { display: true, text: 'Principal Quantum Number (n)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    animation: false,
  };

  useEffect(() => {
    const chart = canvasRef.current?.firstChild?._chartInstance || canvasRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const xScale = chart.scales.x;
    const yScale = chart.scales.y;

    // Draw transition arrow
    const x1 = xScale.getPixelForTick(n1 - 1);
    const x2 = xScale.getPixelForTick(n2 - 1);
    const y1 = yScale.getPixelForValue(Ei);
    const y2 = yScale.getPixelForValue(Ef);

    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLength = 10;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 6), y2 - arrowLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 6), y2 - arrowLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw spectral series markers
    seriesLines.forEach((s, i) => {
      const x = xScale.getPixelForTick(s.n1 - 1);
      const y1 = yScale.getPixelForValue(s.E1);
      const y2 = yScale.getPixelForValue(s.E2);
      ctx.strokeStyle = s.color;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = s.color;
      ctx.fillText(s.name, x - 15, y2 - 10);
    });

    ctx.restore();
  });

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-xl font-semibold mb-2">Bohr Model Transitions</h2>
      <div className="flex justify-center gap-2 mb-3">
        <label>Z <input type="number" value={Z} onChange={(e) => setZ(+e.target.value)} className="w-16 text-black" /></label>
        <label>n₁ <input type="number" value={n1} onChange={(e) => setN1(+e.target.value)} className="w-16 text-black" /></label>
        <label>n₂ <input type="number" value={n2} onChange={(e) => setN2(+e.target.value)} className="w-16 text-black" /></label>
      </div>
      <p>λ = {lambda.toFixed(1)} nm, ΔE = {deltaE.toFixed(2)} eV</p>
      <div style={{ height: '320px' }}>
        <Line ref={canvasRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default BohrSimulator;

