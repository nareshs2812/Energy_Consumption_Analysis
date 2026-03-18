import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import '../styles/superAdminAnalytics.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const SuperAdminAnalytics = () => {
  const [areaData, setAreaData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [extremes, setExtremes] = useState({ highest: null, lowest: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    const fetchData = async () => {
      const [areaRes, cityRes, monthlyRes, extremesRes] = await Promise.all([
        axios.get('/api/analytics/area-wise'),
        axios.get('/api/analytics/city-wise'),
        axios.get('/api/analytics/monthly-trends'),
        axios.get('/api/analytics/extremes'),
      ]);
      setAreaData(areaRes.data);
      setCityData(cityRes.data);
      setMonthlyTrends(monthlyRes.data);
      setExtremes(extremesRes.data);
    };
    fetchData().catch(() => {});
  }, []);

  const areaChartData = {
    labels: areaData.map((a) => a._id),
    datasets: [
      {
        label: 'Total Units',
        data: areaData.map((a) => a.totalUnits),
        backgroundColor: '#4f46e5',
      },
    ],
  };

  const cityChartData = {
    labels: cityData.map((c) => c._id),
    datasets: [
      {
        label: 'Total Units',
        data: cityData.map((c) => c.totalUnits),
        backgroundColor: '#22c55e',
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyTrends.map((m) => `${m.month}/${m.year}`),
    datasets: [
      {
        label: 'Total Units',
        data: monthlyTrends.map((m) => m.totalUnits),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.2)',
      },
    ],
  };

  return (
    <>
      <section className="grid">
        <div className="card">
          <h3>Highest / Lowest Consumers</h3>
          <div className="extremes">
            <div>
              <h4>Highest</h4>
              {extremes.highest ? (
                <p>
                  {extremes.highest.name} ({extremes.highest.email}) -{' '}
                  {extremes.highest.totalUnits} units
                </p>
              ) : (
                <p>No data</p>
              )}
            </div>
            <div>
              <h4>Lowest</h4>
              {extremes.lowest ? (
                <p>
                  {extremes.lowest.name} ({extremes.lowest.email}) -{' '}
                  {extremes.lowest.totalUnits} units
                </p>
              ) : (
                <p>No data</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3>Area-wise Consumption</h3>
          <Bar data={areaChartData} />
        </div>
        <div className="card">
          <h3>City-wise Consumption</h3>
          <Bar data={cityChartData} />
        </div>
      </section>

      <section className="grid">
        <div className="card full-width">
          <h3>Monthly Trends</h3>
          <Line data={monthlyChartData} />
        </div>
      </section>
    </>
  );
};

export default SuperAdminAnalytics;

