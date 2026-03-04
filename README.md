Smart Campus Energy Intelligence System ⚡🏫

A full-stack AI-powered energy monitoring dashboard that visualizes campus electricity consumption using 3D spatial visualization, anomaly detection, and predictive forecasting.

The system allows users to monitor building-level energy usage, detect abnormal consumption patterns, and forecast future energy demand using machine learning.

Key Features 🚀
3D Campus Energy Visualization

Interactive 3D campus dashboard using Three.js

Buildings dynamically scale based on energy consumption

High consumption buildings highlighted visually

Energy Analytics Dashboard

Real-time building energy monitoring

Monthly consumption analysis

Carbon emission estimation

Anomaly Detection

Detects unusual energy spikes using statistical threshold modeling.

Condition used:

Latest Consumption > Average Consumption × 1.25

If anomaly detected:

Building glows red

Alert shown on dashboard

Graph highlights anomaly point

Energy Forecasting (ML)

Predicts next month energy usage using regression modeling.

Implemented with:

Python

Scikit-learn

Linear Regression

Data Visualization

Interactive time-series graphs

Monthly energy consumption trends

Forecast extension in charts

Dynamic Data System

Energy data stored in MongoDB

Dashboard updates automatically when data changes

Visualization updates in real time

Tech Stack 🧠
Frontend

React.js

Three.js / React Three Fiber

Chart.js

CSS3

Backend

Node.js

Express.js

MongoDB

Mongoose

Machine Learning Service

Python

Scikit-learn

NumPy

System Architecture 🏗
React Dashboard
      ↓
Node.js / Express API
      ↓
MongoDB Database
      ↓
Python ML Service
(Forecasting + Analysis)
Project Structure 📂
Smart-Campus-Energy/

frontend + backend combined

src/
 ├── components/App.js
 │    
 ├── services/
 │      api.js
 │      mlService.js
 │
 └── App.js

routes/
models/
ml_service/
server.js
How To Run The Project ⚙️
1 Install Dependencies
npm install
2 Start Backend Server
node server.js
3 Start React Frontend
npm start
4 Run Python ML Service Dependencies

Install Python libraries:

pip install numpy scikit-learn
Machine Learning Module 📊

The ML service predicts next month energy consumption using linear regression.

Input:

[3000, 3200, 3500, 4000]

Output:

Predicted Next Month: 4300 kWh

This allows proactive energy management.

Example Dashboard Metrics 📈

Total Buildings

Selected Building Consumption

Carbon Emission Estimate

Energy Status Indicator

Next Month Energy Prediction

Future Improvements 🔮

User authentication system

Multi-user building management

Energy efficiency scoring

Renewable energy integration

Real-time IoT meter integration

AI-based optimization recommendations

Why This Project Is Unique 💡

Most energy dashboards only display data.

This system integrates:

3D spatial visualization

Energy anomaly detection

Machine learning forecasting

Full-stack architecture

to create a smart energy intelligence platform.

Author 👨‍💻

Shivam

BTech CSE Student
Focused on Data Science, AI Systems, and Full-Stack Development
