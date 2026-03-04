import "./App.css";
import { useEffect, useState, useMemo } from "react";
import { fetchBuildings, fetchEnergyBuilding } from "./services/api";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const getLatestUnits = (data) => {
  if (!data || data.length === 0) return 1000;
  return data[data.length - 1].unitsConsumed;
};

// This function was moved from inside the App component to fix a syntax error.
// Note: This function is currently not being used in the App component.
// The component uses a local `predictNextMonth` function for predictions,
// while this function is set up to call the backend ML service.
export const fetchPrediction = async (energyData) => {
  const values = energyData.map((e) => e.unitsConsumed);

  const res = await fetch("http://localhost:5000/api/energy/forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });

  const data = await res.json();
  return data.prediction;
};

const getColor = (units) => {
  if (units < 3000) return "#00ff88";
  if (units < 4500) return "#00f5ff";
  return "#ff3b3b";
};

function App() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [energyData, setEnergyData] = useState([]);

  useEffect(() => {
    async function loadBuildings() {
      try {
        const res = await fetchBuildings();
        setBuildings(res.data);
      } catch (err) {
        console.error("Error fetching buildings: ", err);
      }
    }
    loadBuildings();
  }, []);

  useEffect(() => {
    if (!selectedBuilding) return;
    async function loadEnergy() {
      try {
        const res = await fetchEnergyBuilding(selectedBuilding);
        setEnergyData(res.data);
      } catch (err) {
        console.error("Error fetching energy: ", err);
      }
    }

    loadEnergy();
  }, [selectedBuilding]);

  //Anamoly Logic Adding Here
  // Memoizing derived state to prevent re-calculations on every render.
  const isAnomaly = useMemo(() => {
    if (energyData.length < 2) return false;

    const latest = energyData[energyData.length - 1].unitsConsumed;
    const previous = energyData
      .slice(0, energyData.length - 1)
      .map((e) => e.unitsConsumed);
    const avg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
    return latest > avg * 1.25;
  }, [energyData]);

  const predictedValue = useMemo(() => {
    if (energyData.length < 2) return null;

    const values = energyData.map((e) => e.unitsConsumed);
    const n = values.length;

    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += (i - xMean) ** 2;
    }

    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    return Math.round(slope * n + intercept);
  }, [energyData]);

  const chartData = useMemo(() => {
    const extendedLabels = [...energyData.map((e) => e.month), "Next"];
    const extendedValues = [
      ...energyData.map((e) => e.unitsConsumed),
      predictedValue,
    ];
    return {
      labels: extendedLabels,
      datasets: [
        {
          label: "Energy Consumption (kwh)",
          data: extendedValues,
          borderColor: "#00f5ff",
          backgroundColor: "rgba(0,245,255,0.2)",
          tension: 0.4,
          pointBackgroundColor: energyData.map((item, index) => (index === energyData.length - 1 && isAnomaly ? "#ff0000" : "#00f5ff")),
          pointRadius: 6,
        },
      ],
    };
  }, [energyData, isAnomaly, predictedValue]);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Campus Energy</h2>
        <ul>
          {buildings.map((b) => (
            <li
              key={b._id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedBuilding(b._id)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setSelectedBuilding(b._id)}
              style={{ cursor: "pointer" }}
            >
              {b.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="main">
        <div className="kpi-container">
          <div className="kpi-card">
            <h4>Total Building</h4>
            <p>{buildings.length}</p>
          </div>
          <div className="kpi-card">
            <h4>Selected Usage</h4>
            <p>{energyData.length > 0 ? energyData[energyData.length - 1].unitsConsumed : "__"} kwh</p>
          </div>
          <div className="kpi-card">
            <h4>Carbon Emission</h4>
            <p>{energyData.length > 0 ? (energyData[energyData.length - 1].unitsConsumed * 0.82).toFixed(2) : "__"} kg</p>
          </div>
          <div className="kpi-card">
            <h4>Status</h4>
            <p style={{ color: isAnomaly ? "#ff3b3b" : "#00ff88" }}>
              {isAnomaly ? "High Usage Alert 🚨🚨" : "Normal"}
            </p>
          </div>

          <div className="kpi-card">
            <h4>Next Month Prediction</h4>
            <p>{predictedValue ? predictedValue + "kwh" : "__"}</p>
          </div>
        </div>

        <div className="canvas-area">
          <Canvas camera={{ position: [0, 5, 8] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {buildings.map((b, index) => {
              const units =
                b._id === selectedBuilding ? getLatestUnits(energyData) : 2000;
              const height = units / 1000;

              return (
                <mesh
                  key={b._id}
                  position={[(index - buildings.length / 2) * 3, height / 2, 0]}
                >
                  <boxGeometry args={[2, height, 2]} />
                  <meshStandardMaterial color={isAnomaly ? "#ff0000" : getColor(units)}
                    emissive={isAnomaly ? "#ff0000" : "#000000"}
                    emissiveIntensity={isAnomaly ? 0.8 : 0}
                  // emissive={b._id === selectedBuilding ? "#ffffff" : "#000000"} 
                  />
                </mesh>
              );
            })}

            <OrbitControls />
          </Canvas>
        </div>
      </div>

      <div className="analytics">
        <h3>Energy Analytics</h3>
        {energyData.length > 0 ? (
          <>
            <p>
              Latest Units: {energyData[energyData.length - 1].unitsConsumed} kwh
            </p>
            <div style={{ marginTop: "20px" }}>
              <Line data={chartData} />
            </div>
          </>
        ) : (
          <p>Select a building</p>
        )}
      </div>
    </div>
  );
}

export default App;