import React, { useState } from "react";
import "./App.css";
import { Pie, Line } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";  // Import the spinner
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function App() {
  const initialFormData = {
    op_setting_1: "",
    op_setting_2: "",
    op_setting_3: "",
  };

  for (let i = 1; i <= 21; i++) {
    initialFormData[`sensor_measurement_${i}`] = "";
  }

  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner when request is sent
    try {
      const response = await fetch("https://predictive-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setResult(data);
      setHistory((prev) => [...prev, data]);
      toast.success("Prediction successful! 🎯");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch prediction ❌");
    } finally {
      setLoading(false); // Stop spinner when prediction is done
    }
  };

  // Pie chart: failure type distribution
  const failureCounts = history.reduce((acc, entry) => {
    const type = entry.failure_type || "None";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(failureCounts),
    datasets: [
      {
        data: Object.values(failureCounts),
        backgroundColor: ["#ff6b6b", "#5f27cd", "#1dd1a1", "#54a0ff"],
      },
    ],
  };

  // Line chart: RUL trend
  const lineData = {
    labels: history.map((_, idx) => `Prediction ${idx + 1}`),
    datasets: [
      {
        label: "Predicted RUL",
        data: history.map((entry) => entry.predicted_rul),
        fill: false,
        backgroundColor: "#1dd1a1",
        borderColor: "#10ac84",
      },
    ],
  };

  return (
    <div className="app-container" style={{ 
        backgroundImage: "url('/assets/images/Predictive-Maintenance-1024x532 - Copy.webp')", 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
        minHeight: "100vh" 
      }}>
      <div className="form-section" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", padding: "20px", borderRadius: "10px", maxWidth: "800px", margin: "auto" }}>
        <h1 style={{ textAlign: "center", color: "#00ffff" }}>Predictive Maintenance</h1>
        <form onSubmit={handleSubmit}>
          {/* Operational Settings */}
          {[1, 2, 3].map((num) => (
            <div key={`op_setting_${num}`}>
              <label><b>Operational Setting {num}:</b></label>
              <input
                type="text"
                name={`op_setting_${num}`}
                value={formData[`op_setting_${num}`]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Sensor Inputs */}
          {[...Array(21)].map((_, index) => {
            const name = `sensor_measurement_${index + 1}`;
            return (
              <div key={name}>
                <label><b>Sensor Measurement {index + 1}:</b></label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            );
          })}

          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#00ffff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }}>
            Predict
          </button>
        </form>

        {/* Show Spinner if loading */}
        {loading && (
          <div className="loading-spinner" style={{ textAlign: "center", marginTop: "20px" }}>
            <ClipLoader color="#36d7b7" loading={loading} size={50} />
            <p>Predicting...</p>
          </div>
        )}

        {result && !loading && (
          <div className="result" style={{ marginTop: "30px", color: "#fff" }}>
            <h2>Prediction Result</h2>
            <p><strong>Failure Type:</strong> {result.failure_type}</p>
            <p><strong>Predicted RUL:</strong> {result.predicted_rul}</p>
          </div>
        )}
      </div>

      {/* Visualization Section */}
      <div className="charts-section" style={{ marginTop: "50px", color: "#fff" }}>
        <h2>Failure Type Distribution</h2>
        <Pie data={pieData} />

        <h2>RUL Prediction Trend</h2>
        <Line data={lineData} />
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default App;
