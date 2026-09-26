import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [aiInsights, setAiInsights] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // 1. Fetch student dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/student/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudentData(data);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 2. Fetch AI Insights from Backend
  const handleGetAiInsights = async () => {
    console.log("AI Insights requested...");
    setLoadingAi(true);
    setAiInsights("");

    // Use studentData if available, fallback to localStorage/defaults
    const payload = {
      name: studentData?.name || localStorage.getItem("userName") || "Student",
      rollNo: studentData?.rollNo || localStorage.getItem("rollNo") || "N/A",
      marks: studentData?.marks || [
        { subject: "Mathematics", score: 85 },
        { subject: "Computer Science", score: 90 },
      ],
    };

    try {
      const response = await fetch(`${API_URL}/api/ai/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setAiInsights(data.insights);
      } else {
        setAiInsights(data.error || "Failed to fetch AI insights. Please try again.");
      }
    } catch (error) {
      console.error("AI Fetch Error:", error);
      setAiInsights("Error connecting to AI service.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Student Dashboard</h2>

      {loadingData ? (
        <p>Loading dashboard profile...</p>
      ) : (
        studentData && (
          <div style={{ marginBottom: "20px" }}>
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>Roll No:</strong> {studentData.rollNo}</p>
          </div>
        )
      )}

      {/* AI Insights Card */}
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
          backgroundColor: "#f9f9ff",
        }}
      >
        <h3>🤖 AI Performance Assistant</h3>
        <p>Get instant AI-driven analysis and tips based on your marks.</p>

        <button
          onClick={handleGetAiInsights}
          disabled={loadingAi}
          type="button"
          style={{
            padding: "10px 16px",
            backgroundColor: loadingAi ? "#999" : "#6200ee",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loadingAi ? "not-allowed" : "pointer",
          }}
        >
          {loadingAi ? "Generating Insights..." : "Generate AI Insights"}
        </button>

        {aiInsights && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: "#ffffff",
              borderLeft: "4px solid #6200ee",
              whiteSpace: "pre-wrap",
            }}
          >
            {aiInsights}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;