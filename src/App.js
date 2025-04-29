import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://predictive-maintenance-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch prediction. Check if Flask server is running and CORS is allowed.");
    }
  };

  const COLORS = ["#00C49F", "#FF8042"]; // For pie chart colors

  const failureData = result ? [
    { name: result.failure_type, value: 70 }, 
    { name: "No Failure", value: 30 }
  ] : [];

  const rulData = result ? [
    { name: "Remaining Life", value: result.predicted_rul }
  ] : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/Predictive-Maintenance-1024x532.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#ffffff",
        padding: "50px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "40px",
          maxWidth: "700px",
          margin: "auto",
          borderRadius: "15px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#00ffff" }}>Predictive Maintenance For Machinery Using Machine Learning</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Operational Setting 1:</label>
            <input
              type="number"
              step="0.1"
              name="op_setting_1"
              value={formData.op_setting_1}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Operational Setting 2:</label>
            <input
              type="number"
              step="0.1"
              name="op_setting_2"
              value={formData.op_setting_2}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Operational Setting 3:</label>
            <input
              type="number"
              step="0.1"
              name="op_setting_3"
              value={formData.op_setting_3}
              onChange={handleChange}
              required
            />
          </div>

          {[...Array(21)].map((_, index) => {
            const sensorName = `sensor_measurement_${index + 1}`;
            return (
              <div key={sensorName}>
                <label>{`Sensor Measurement ${index + 1}:`}</label>
                <input
                  type="number"
                  step="0.1"
                  name={sensorName}
                  value={formData[sensorName]}
                  onChange={handleChange}
                  required
                />
              </div>
            );
          })}

          <button
            type="submit"
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#00ffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Predict
          </button>
        </form>

        {result && (
          <div style={{ marginTop: "30px", color: "#fff" }}>
            <h2 style={{ textAlign: "center" }}>Prediction Result</h2>
            <p style={{ fontSize: "20px" }}>
              <strong>Failure Type:</strong> {result.failure_type}
            </p>
            <p style={{ fontSize: "20px" }}>
              <strong>Predicted RUL:</strong> {result.predicted_rul}
            </p>

            {/* Visualizations Section */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", marginTop: "30px" }}>
              
              {/* Pie Chart for Failure Type */}
              <div style={{ width: "300px", height: "300px" }}>
                <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Failure Analysis</h3>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={failureData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {failureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart for RUL */}
              <div style={{ width: "300px", height: "300px" }}>
                <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Remaining Useful Life</h3>
                <ResponsiveContainer>
                  <BarChart data={rulData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
