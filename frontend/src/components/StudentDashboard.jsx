import React, { useState, useEffect } from "react";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user info stored during login
  const token = localStorage.getItem("token");
  const storedRollNo = localStorage.getItem("rollNo"); // ensure rollNo is saved on login

  useEffect(() => {
    if (!storedRollNo) {
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/student-dashboard/${storedRollNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Failed to load student portal data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [storedRollNo, token]);

  if (loading) return <div style={{ padding: "20px" }}>Loading your dashboard...</div>;
  if (!storedRollNo || !data) return <div style={{ padding: "20px" }}>No student profile linked or found.</div>;

  const { profile, attendance, marks } = data;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Student Portal</h2>

      {/* Profile Card */}
      <div style={cardStyle}>
        <h3>Profile Information</h3>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Roll No:</strong> {profile.rollNo}</p>
        <p><strong>Course:</strong> {profile.course}</p>
        <p><strong>Age:</strong> {profile.age}</p>
      </div>

      {/* Attendance Summary */}
      <div style={cardStyle}>
        <h3>Attendance Summary</h3>
        <p><strong>Total Classes:</strong> {attendance.totalClasses}</p>
        <p><strong>Attended:</strong> {attendance.presentClasses}</p>
        <p><strong>Attendance Percentage:</strong> <span style={{ color: "#007bff", fontWeight: "bold" }}>{attendance.percentage}%</span></p>
      </div>

      {/* Marks Summary */}
      <div style={cardStyle}>
        <h3>Marks & Results</h3>
        {marks.length === 0 ? (
          <p>No marks recorded yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }} border="1">
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "8px" }}>Subject</th>
                <th style={{ padding: "8px" }}>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "8px" }}>{m.subject}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{m.marksObtained}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};