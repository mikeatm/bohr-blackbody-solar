import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function AtomicTrendsApp() {
  const [tab, setTab] = useState("trends");

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Atomic Explorer Suite</h1>
      <div className="flex justify-center space-x-3 flex-wrap">
        {["trends", "config", "zeff", "ionization", "3d"].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-xl shadow ${tab === t ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      {tab === "trends" && <PeriodicTrendExplorer />}
      {tab === "config" && <ElectronConfigVisualizer />}
      {tab === "zeff" && <ZeffSimulator />}
      {tab === "ionization" && <IonizationPlotter />}
      {tab === "3d" && <ThreeDPeriodicTable />}
    </div>
  );
}

// ---------- Periodic Trend Explorer ----------
function PeriodicTrendExplorer() {
  const [property, setProperty] = useState("atomic_radius");

  const periodicData = {
    atomic_radius: {
      label: "Atomic Radius (pm)",
      data: {
        H: 53, He: 31, Li: 167, Be: 112, B: 87, C: 67, N: 56, O: 48, F: 42, Ne: 38,
        Na: 190, Mg: 145, Al: 118, Si: 111, P: 98, S: 88, Cl: 79, Ar: 71,
      },
    },
    ionization_energy: {
      label: "Ionization Energy (kJ/mol)",
      data: {
        H: 1312, He: 2372, Li: 520, Be: 900, B: 800, C: 1086, N: 1402, O: 1314, F: 1681, Ne: 2080,
        Na: 496, Mg: 738, Al: 578, Si: 787, P: 1012, S: 1000, Cl: 1251, Ar: 1520,
      },
    },
  };

  const labels = Object.keys(periodicData[property].data);
  const values = Object.values(periodicData[property].data);

  const chartData = {
    labels,
    datasets: [
      {
        label: periodicData[property].label,
        data: values,
        backgroundColor: "rgba(59,130,246,0.6)",
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Periodic Trend Explorer</h2>
      <select className="border p-2" value={property} onChange={(e) => setProperty(e.target.value)}>
        <option value="atomic_radius">Atomic Radius</option>
        <option value="ionization_energy">Ionization Energy</option>
      </select>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

// ---------- Electron Configuration Visualizer ----------
function ElectronConfigVisualizer() {
  const [Z, setZ] = useState(1);
  const configs = [
    "1s1", "1s2", "1s2 2s1", "1s2 2s2", "1s2 2s2 2p1", "1s2 2s2 2p2", "1s2 2s2 2p3",
    "1s2 2s2 2p4", "1s2 2s2 2p5", "1s2 2s2 2p6", "1s2 2s2 2p6 3s1", "1s2 2s2 2p6 3s2",
    "1s2 2s2 2p6 3s2 3p1", "1s2 2s2 2p6 3s2 3p2", "1s2 2s2 2p6 3s2 3p3",
    "1s2 2s2 2p6 3s2 3p4", "1s2 2s2 2p6 3s2 3p5", "1s2 2s2 2p6 3s2 3p6",
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Electron Configuration Visualizer</h2>
      <input
        type="range"
        min="1"
        max={configs.length}
        value={Z}
        onChange={(e) => setZ(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
      <p>Atomic Number: {Z}</p>
      <p>Configuration: {configs[Z - 1]}</p>
      <div className="grid grid-cols-5 gap-2">
        {configs[Z - 1].split(" ").map((orb, i) => (
          <div key={i} className="border rounded-lg p-3 text-center bg-blue-50 text-black">
            {orb}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Effective Nuclear Charge Simulator ----------
function ZeffSimulator() {
  const [Z, setZ] = useState(8);
  const [S, setS] = useState(2);
  const Zeff = Z - S;

  const distances = Array.from({ length: 50 }, (_, i) => i / 10 + 0.1);
  const forces = distances.map((r) => Zeff / r);

  const chartData = {
    labels: distances.map((r) => r.toFixed(1)),
    datasets: [
      {
        label: "Effective Nuclear Attraction (a.u.)",
        data: forces,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.3)",
      },
    ],
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Effective Nuclear Charge Simulator</h2>
      <label>Z (Protons): {Z}</label>
      <input type="range" min="1" max="20" value={Z} onChange={(e) => setZ(Number(e.target.value))} className="w-full cursor-pointer" />
      <label>S (Shielding Electrons): {S}</label>
      <input type="range" min="0" max={Z - 1} value={S} onChange={(e) => setS(Number(e.target.value))} className="w-full cursor-pointer" />
      <p className="text-lg">Zeff = {Zeff}</p>
      <div className="h-[300px]">
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

// ---------- Ionization Energy Plotter ----------
function IonizationPlotter() {
  const elements = ["Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"];
  const IE1 = [520, 900, 800, 1086, 1402, 1314, 1681, 2080, 496, 738, 578, 787, 1012, 1000, 1251, 1520];
  const chartData = {
    labels: elements,
    datasets: [
      {
        label: "First Ionization Energy (kJ/mol)",
        data: IE1,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.3)",
      },
    ],
  };
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Ionization Energy Plotter</h2>
      <div className="h-[300px]">
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

// ---------- 3D Periodic Table ----------
function ThreeDPeriodicTable() {
  useEffect(() => {
    const container = document.getElementById("threejs-container");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, 400);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);

    const elements = [
      { symbol: "H", number: 1, group: 1, period: 1, color: "#3b82f6" },
      { symbol: "He", number: 2, group: 18, period: 1, color: "#a855f7" },
      { symbol: "Li", number: 3, group: 1, period: 2, color: "#10b981" },
      { symbol: "Be", number: 4, group: 2, period: 2, color: "#f59e0b" },
      { symbol: "B", number: 5, group: 13, period: 2, color: "#ef4444" },
      { symbol: "C", number: 6, group: 14, period: 2, color: "#f97316" },
      { symbol: "N", number: 7, group: 15, period: 2, color: "#6366f1" },
      { symbol: "O", number: 8, group: 16, period: 2, color: "#22d3ee" },
      { symbol: "F", number: 9, group: 17, period: 2, color: "#84cc16" },
      { symbol: "Ne", number: 10, group: 18, period: 2, color: "#ec4899" },
    ];

    elements.forEach((el) => {
      const cube = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: el.color })
      );
      cube.position.set(el.group / 2 - 9, -el.period + 1, 0);
      scene.add(cube);
    });

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => container.removeChild(renderer.domElement);
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">3D Periodic Table</h2>
      <div id="threejs-container" className="w-full h-[400px] border rounded-lg"></div>
      <p className="text-sm text-gray-500">Data: NIST Chemistry WebBook, CRC Handbook of Chemistry & Physics</p>
    </div>
  );
}

