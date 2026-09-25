import React, { useState, useEffect } from "react";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    topPerformers: [],
    subjectAverages: [],
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) {
          // Process analytics metrics from system data
          setAnalyticsData({
            topPerformers: result.data.topPerformers || [],
            subjectAverages: result.data.subjectAverages || [],
          });
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) return <div style={{ padding: "20px" }}>Loading Analytics...</div>;

  return (
    <main className="dashboard" style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Academic Analytics</h1>
      <p>Overview of academic performance across subjects and students.</p>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>System Performance Metrics</h3>
          <p>Analytical aggregation is active across all registered subjects.</p>
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  flex: "1",
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

export default Analytics;