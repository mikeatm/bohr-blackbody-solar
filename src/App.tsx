import React, { useState } from 'react'
import BohrSimulator from './components/BohrSimulator'
import BlackbodyPlot from './components/BlackbodyPlot'
import SolarSpectrum from './components/SolarSpectrum'

function App() {
  const [tab, setTab] = useState('bohr')
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Bohr–Blackbody–Solar Lab</h1>
      <div className="flex justify-center gap-4 mb-6">
        {['bohr','blackbody','spectrum'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg ${tab===t ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {t === 'bohr' ? 'Bohr Model' : t === 'blackbody' ? 'Blackbody Radiation' : 'Solar Spectrum'}
          </button>
        ))}
      </div>
      {tab === 'bohr' && <BohrSimulator />}
      {tab === 'blackbody' && <BlackbodyPlot />}
      {tab === 'spectrum' && <SolarSpectrum />}
    </div>
  )
}
export default App
