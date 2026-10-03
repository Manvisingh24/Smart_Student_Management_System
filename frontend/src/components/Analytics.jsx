import React, { useState, useEffect } from "react";

export default function Analytics() {
  const [summary, setSummary] = useState({
    totalStudents: 0,
    classAvgAttendance: 0,
    classAvgMarks: 0,
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/analytics", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const result = await res.json();
      if (result.success) {
        setSummary(result.summary);
        setStudents(result.students);
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>Loading overall analytics...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2>Analytics & Overall Monthly Performance</h2>

      {/* Class Summary KPI Cards */}
      <div style={kpiGridStyle}>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Total Students</span>
          <p style={cardValueStyle}>{summary.totalStudents}</p>
        </div>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Overall Class Attendance Avg</span>
          <p style={{ ...cardValueStyle, color: summary.classAvgAttendance >= 75 ? "#16a34a" : "#dc2626" }}>
            {summary.classAvgAttendance}%
          </p>
        </div>
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Overall Marks Avg</span>
          <p style={cardValueStyle}>{summary.classAvgMarks}%</p>
        </div>
      </div>

      {/* Comprehensive Student Performance Table */}
      <h3 style={{ marginTop: "30px" }}>Overall Student Performance Metrics</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={cellStyle}>Roll No</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Course</th>
            <th style={cellStyle}>Overall Attendance Avg</th>
            <th style={cellStyle}>Overall Marks Avg</th>
            <th style={cellStyle}>Academic Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.rollNo} style={rowStyle}>
              <td style={cellStyle}>{student.rollNo}</td>
              <td style={cellStyle}><strong>{student.name}</strong></td>
              <td style={cellStyle}>{student.course || "N/A"}</td>
              <td style={cellStyle}>
                <strong style={{ color: student.overallAttendancePercentage >= 75 ? "#16a34a" : "#dc2626" }}>
                  {student.overallAttendancePercentage}%
                </strong>
              </td>
              <td style={cellStyle}>{student.overallAvgMarks}%</td>
              <td style={cellStyle}>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor:
                      student.overallAttendancePercentage >= 75 ? "#dcfce7" : "#fee2e2",
                    color:
                      student.overallAttendancePercentage >= 75 ? "#15803d" : "#b91c1c",
                  }}
                >
                  {student.overallAttendancePercentage >= 75 ? "GOOD STANDING" : "LOW ATTENDANCE"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styling Objects
const kpiGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  borderLeft: "4px solid #2563eb",
};

const cardTitleStyle = { fontSize: "14px", color: "#64748b", fontWeight: "600" };
const cardValueStyle = { fontSize: "28px", fontWeight: "bold", margin: "10px 0 0 0", color: "#0f172a" };

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  overflow: "hidden",
};

const headerRowStyle = { backgroundColor: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" };
const rowStyle = { borderBottom: "1px solid #e2e8f0" };
const cellStyle = { padding: "12px 16px" };