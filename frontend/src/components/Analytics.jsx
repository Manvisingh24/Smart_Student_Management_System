import React, { useState, useEffect } from "react";

export default function Analytics() {
  // Default to current YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async (month) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/students/analytics/monthly?month=${month}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        setAnalyticsData(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedMonth);
  }, [selectedMonth]);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Monthly Attendance Analytics</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        />
      </div>

      {loading ? (
        <p>Loading analytics data...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "12px" }}>Roll No</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Course</th>
              <th style={{ padding: "12px" }}>Total Classes</th>
              <th style={{ padding: "12px" }}>Present</th>
              <th style={{ padding: "12px" }}>Monthly %</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.map((item) => (
              <tr key={item.rollNo} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px" }}>{item.rollNo}</td>
                <td style={{ padding: "12px" }}><strong>{item.name}</strong></td>
                <td style={{ padding: "12px" }}>{item.course}</td>
                <td style={{ padding: "12px" }}>{item.totalClasses}</td>
                <td style={{ padding: "12px" }}>{item.totalPresent}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    fontWeight: "bold",
                    color: item.monthlyAverage >= 75 ? "#15803d" : "#b91c1c"
                  }}>
                    {item.monthlyAverage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}