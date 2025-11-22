import React, { useState } from 'react'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend)

const R = 1.097e7 // Rydberg constant (m^-1)

const seriesInfo = {
  Lyman: { n2: 1, color: 'violet' },
  Balmer: { n2: 2, color: 'cyan' },
  Paschen: { n2: 3, color: 'orange' },
  Pfund: { n2: 5, color: 'green' },
}

const BohrSimulator = () => {
  const [Z, setZ] = useState(1)
  const [n1, setN1] = useState(3)
  const [n2, setN2] = useState(2)
  const [series, setSeries] = useState<'Lyman' | 'Balmer' | 'Paschen' | 'Pfund' | null>(null)

  const Ei = -13.6 * Z * Z / (n1 * n1)
  const Ef = -13.6 * Z * Z / (n2 * n2)
  const deltaE = Ei - Ef
  const hc = 6.626e-34 * 3e8
  const wavelength = hc / (Math.abs(deltaE) * 1.602e-19)
  const nm = wavelength * 1e9
  const direction = deltaE > 0 ? '↓ emission' : '↑ absorption'

  // Calculate selected spectral series wavelengths
  const seriesLines = series
    ? Array.from({ length: 8 }, (_, i) => {
        const n1s = i + seriesInfo[series].n2 + 1
        const λ = 1 / (R * (1 / seriesInfo[series].n2 ** 2 - 1 / n1s ** 2)) * 1e9
        return λ
      })
    : []

  const levels = Array.from({ length: 6 }, (_, i) => i + 1)
  const y = levels.map((n) => -13.6 / (n * n))

  const data = {
    labels: levels.map((n) => `n=${n}`),
    datasets: [
      {
        label: 'Energy Levels',
        data: y,
        borderColor: 'cyan',
        pointBackgroundColor: 'cyan',
        tension: 0,
      },
      {
        label: 'Transition',
        data: levels.map((n) => (n === n1 || n === n2 ? -13.6 / (n * n) : null)),
        borderColor: 'red',
        borderDash: [5, 5],
        pointRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: 'white' } },
      title: { display: true, text: 'Bohr Energy Levels (eV)', color: 'white' },
    },
    scales: {
      x: { ticks: { color: 'white' } },
      y: { ticks: { color: 'white' } },
    },
  }

  return (
    <div className="max-w-3xl mx-auto text-center" style={{ width: '100%', height: '320px' }}>
      <h2 className="text-xl font-semibold mb-2">Bohr Model Photon Transitions</h2>
      <div className="flex justify-center gap-2 mb-4">
        <label>
          Z <input type="number" value={Z} onChange={(e) => setZ(+e.target.value)} className="w-16 text-black" />
        </label>
        <label>
          n₁ <input type="number" value={n1} onChange={(e) => setN1(+e.target.value)} className="w-16 text-black" />
        </label>
        <label>
          n₂ <input type="number" value={n2} onChange={(e) => setN2(+e.target.value)} className="w-16 text-black" />
        </label>
      </div>
      <p>
        λ = {nm.toFixed(1)} nm ({direction}), ΔE = {Math.abs(deltaE).toFixed(2)} eV
      </p>

      <div style={{ height: '320px' }} className="my-4">
        <Line data={data} options={options} />
      </div>

      <div className="flex justify-center gap-2 mb-2">
        {Object.keys(seriesInfo).map((s) => (
          <button
            key={s}
            onClick={() => setSeries(s as any)}
            className={`px-3 py-1 rounded-lg text-sm ${series === s ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {series && (
        <div className="mt-2 text-sm text-gray-300">
          <p>
            {series} series (n₂ = {seriesInfo[series].n2}) predicted wavelengths:
          </p>
          <p>{seriesLines.map((λ) => λ.toFixed(1)).join(', ')} nm</p>
        </div>
      )}
    </div>
  )
}

export default BohrSimulator

