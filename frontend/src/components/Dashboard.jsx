import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: 0,
    avgMarks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authorization token found in localStorage.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3000/api/dashboard/stats", {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
        });

        if (res.status === 401) {
          console.error("Session expired or token invalid (401).");
          setLoading(false);
          return;
        }

        const result = await res.json();

        if (result.success) {
          setStats({
            totalStudents: result.data.totalStudents,
            avgAttendance: result.data.avgAttendance,
            avgMarks: result.data.avgMarks,
          });
        }
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Handler for Admin Class-Wide AI Insights
  const handleGetAdminAiInsights = async () => {
    setLoadingAi(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: "Admin",
        rollNo: "ADMIN-OVERVIEW",
        marks: [
          { subject_name: "Class Aggregate Performance", score: stats.avgMarks },
          { subject_name: "Overall Attendance Rate", score: stats.avgAttendance }
        ]
      };

      const res = await fetch("http://localhost:3000/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentData: payload }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiInsights(data.insights);
      } else {
        alert(data.message || "Failed to generate class AI insights");
      }
    } catch (err) {
      console.error("Error generating AI insights:", err);
      alert("Error connecting to AI service.");
    } finally {
      setLoadingAi(false);
    }
  };

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

      {/* System Overview Panel */}
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9", marginBottom: "20px" }}>
        <h4>System Status</h4>
        <p>All core services (Authentication, Students, Attendance, Marks, Analytics) are connected and operating.</p>
      </div>

      {/* Admin AI Analytics Section */}
      <div style={{ border: "1px solid #007bff", padding: "20px", borderRadius: "8px", backgroundColor: "#f0f7ff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0, color: "#0056b3" }}>🤖 Institutional AI Insights</h3>
          <button
            onClick={handleGetAdminAiInsights}
            disabled={loadingAi}
            style={{
              padding: "10px 18px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {loadingAi ? "Analyzing Class Data..." : "Generate Class AI Insights"}
          </button>
        </div>

        {aiInsights ? (
          <div style={{ whiteSpace: "pre-line", backgroundColor: "#fff", padding: "15px", borderRadius: "6px", border: "1px solid #cce5ff" }}>
            {aiInsights}
          </div>
        ) : (
          <p style={{ color: "#666", margin: 0 }}>
            Click the button above to analyze overall institutional metrics (Total Students: {stats.totalStudents}, Avg Marks: {stats.avgMarks}%).
          </p>
        )}
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