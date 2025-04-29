// src/PredictForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PredictForm = () => {
  const [sensorData, setSensorData] = useState({
    sensor_measurement_2: '',
    sensor_measurement_4: '',
    sensor_measurement_9: '',
    sensor_measurement_11: '',
    sensor_measurement_15: ''
  });
  const [prediction, setPrediction] = useState(null);

  const API_URL = "http://127.0.0.1:5000/predict";

  const handleChange = (e) => {
    setSensorData({ ...sensorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, sensorData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div>
      <h2>Predict Maintenance</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(sensorData).map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type="number"
              name={key}
              value={sensorData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>

      {prediction && (
        <div>
          <h3>Prediction Result:</h3>
          <p><strong>Failure Type:</strong> {prediction.failure_type}</p>
          <p><strong>Predicted RUL:</strong> {prediction.predicted_rul.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default PredictForm;
