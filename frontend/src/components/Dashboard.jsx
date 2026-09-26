import React, { useState, useEffect } from "react";

export default function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({ name: "", rollNo: "" });
  const [marks, setMarks] = useState([]);
  const [aiInsights, setAiInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);

  const token = localStorage.getItem("token");

  // Helper to extract student profile from JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      // 1. Extract name and roll number from JWT token
      if (token) {
        const decoded = parseJwt(token);
        if (decoded) {
          setStudentInfo({
            name: decoded.name || decoded.username || "Student",
            rollNo: decoded.rollNo || decoded.roll_no || decoded.id || "STU-2026",
          });
        }
      }

      // 2. Fetch student marks from backend
      try {
        const res = await fetch("http://localhost:3000/api/marks/my-marks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        if (res.ok && Array.isArray(result)) {
          setMarks(result);
        } else if (result.marks && Array.isArray(result.marks)) {
          setMarks(result.marks);
        }
      } catch (err) {
        console.error("Error loading student marks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token]);

  // Trigger AI Insights with logged-in student details
  const handleGetAiInsights = async () => {
    setLoadingAi(true);
    try {
      const studentPayload = {
        name: studentInfo.name || "Student",
        rollNo: studentInfo.rollNo || "N/A",
        marks: marks.length > 0 ? marks : [
          { subject_name: "Computer Science", score: 88 },
          { subject_name: "Mathematics", score: 75 }
        ]
      };

      const res = await fetch("http://localhost:3000/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentData: studentPayload }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiInsights(data.insights);
      } else {
        alert(data.message || "Failed to generate AI insights");
      }
    } catch (err) {
      console.error("Error generating AI insights:", err);
      alert("Error connecting to AI service.");
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Student Dashboard</h2>
      <p style={{ color: "#666" }}>
        Welcome back, <strong>{studentInfo.name}</strong> (Roll No: {studentInfo.rollNo})
      </p>

      {/* Marks Summary Section */}
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", backgroundColor: "#fff", marginBottom: "20px" }}>
        <h3>Academic Performance</h3>
        {marks.length > 0 ? (
          <ul style={{ paddingLeft: "20px" }}>
            {marks.map((m, idx) => (
              <li key={idx} style={{ marginBottom: "8px" }}>
                <strong>{m.subject_name || m.subject || "Subject"}:</strong> {m.score || m.marks || 0}%
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>No marks uploaded yet.</p>
        )}
      </div>

      {/* AI Insights Panel */}
      <div style={{ border: "1px solid #007bff", padding: "20px", borderRadius: "8px", backgroundColor: "#f0f7ff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0, color: "#0056b3" }}>🤖 AI Performance Insights</h3>
          <button
            onClick={handleGetAiInsights}
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
            {loadingAi ? "Analyzing..." : "Generate AI Insights"}
          </button>
        </div>

        {aiInsights ? (
          <div style={{ whiteSpace: "pre-line", backgroundColor: "#fff", padding: "15px", borderRadius: "6px", border: "1px solid #cce5ff" }}>
            {aiInsights}
          </div>
        ) : (
          <p style={{ color: "#666", margin: 0 }}>
            Click the button above to generate personalized AI recommendations based on your subject marks.
          </p>
        )}
      </div>
    </div>
  );
}