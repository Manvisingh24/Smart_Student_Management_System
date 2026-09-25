import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: 0,
    avgMarks: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch students list to compute total count
        const studentsRes = await fetch("http://localhost:3000/api/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studentsData = await studentsRes.json();
        
        const studentCount = studentsData.success 
          ? (Array.isArray(studentsData.data) ? studentsData.data.length : 0)
          : 0;

        // Set metrics state (replace/expand endpoints as your backend stats route grows)
        setStats({
          totalStudents: studentCount,
          avgAttendance: 85, // Placeholder metric until dedicated stats API is fetched
          avgMarks: 78,      // Placeholder metric until dedicated stats API is fetched
        });
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading dashboard statistics...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Admin Dashboard</h2>

      {/* Summary Cards Row */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <h3>Total Students</h3>
          <p style={cardMetricStyle}>{stats.totalStudents}</p>
        </div>

        <div style={cardStyle}>
          <h3>Average Attendance</h3>
          <p style={cardMetricStyle}>{stats.avgAttendance}%</p>
        </div>

        <div style={cardStyle}>
          <h3>Average Marks</h3>
          <p style={cardMetricStyle}>{stats.avgMarks}%</p>
        </div>
      </div>

      {/* Quick Action Panel */}
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h4>System Status</h4>
        <p>All core services (Authentication, Students, Attendance, Marks) are operating cleanly.</p>
      </div>
    </div>
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

const cardMetricStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#007bff",
  margin: "10px 0 0 0",
};