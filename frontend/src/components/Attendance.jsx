import React, { useState, useEffect } from "react";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftAttendance, setDraftAttendance] = useState({});

  const fetchDailyAttendance = async (dateStr) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/students/attendance/daily?date=${dateStr}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        const records = result.data || [];
        setAttendanceList(records);

        const initialDraft = {};
        records.forEach((s) => {
          initialDraft[s.rollNo] =
            s.status && s.status.toLowerCase() !== "not marked"
              ? s.status
              : "Present";
        });
        setDraftAttendance(initialDraft);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyAttendance(selectedDate);
  }, [selectedDate]);

  const isLocked = attendanceList.some(
    (item) => item.status && item.status.toLowerCase() !== "not marked"
  );

  const handleSelectStatus = (rollNo, status) => {
    setDraftAttendance((prev) => ({
      ...prev,
      [rollNo]: status,
    }));
  };

  const handleSaveAndLock = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = Object.keys(draftAttendance).map((rollNo) => ({
        rollNo,
        status: draftAttendance[rollNo] || "Present",
      }));

      const res = await fetch(
        "http://localhost:3000/api/students/attendance/lock-daily",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: selectedDate,
            records: payload,
          }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success) {
        alert("Attendance saved and locked successfully!");
        fetchDailyAttendance(selectedDate);
      } else {
        alert(result.message || "Failed to save attendance.");
      }
    } catch (err) {
      console.error("Error locking attendance:", err);
      alert("Error connecting to server while locking attendance.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Daily Attendance Register</h2>
        {!isLocked && attendanceList.length > 0 && (
          <button onClick={handleSaveAndLock} style={lockBtnStyle}>
            🔒 Save & Lock Attendance
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
        <label style={{ fontWeight: "bold", color: "#334155" }}>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={dateInputStyle}
        />
        <span style={{ marginLeft: "auto", fontSize: "14px", fontWeight: "600", color: isLocked ? "#16a34a" : "#d97706" }}>
          Status: {isLocked ? "🔒 Locked & Saved" : "📝 Unlocked (Editable)"}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: "20px" }}>Loading attendance records...</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th style={cellStyle}>Roll No</th>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Course</th>
              <th style={cellStyle}>Year</th>
              <th style={cellStyle}>Status ({selectedDate})</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((student) => {
              const currentStatus = draftAttendance[student.rollNo] || "Present";

              return (
                <tr key={student.rollNo} style={rowStyle}>
                  <td style={cellStyle}>{student.rollNo}</td>
                  <td style={cellStyle}><strong>{student.name}</strong></td>
                  <td style={cellStyle}>{student.course || "N/A"}</td>
                  <td style={cellStyle}>{student.year || "4th Year"}</td>
                  <td style={cellStyle}>
                    {isLocked ? (
                      <span style={getStatusBadgeStyle(student.status)}>
                        {student.status.toUpperCase()}
                      </span>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSelectStatus(student.rollNo, "Present")}
                          style={presentBtnStyle(currentStatus)}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectStatus(student.rollNo, "Absent")}
                          style={absentBtnStyle(currentStatus)}
                        >
                          Absent
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const lockBtnStyle = { backgroundColor: "#16a34a", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
const dateInputStyle = { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" };

const getStatusBadgeStyle = (status) => {
  const clean = (status || "").toLowerCase();
  return {
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "12px",
    display: "inline-block",
    backgroundColor: clean === "present" ? "#dcfce7" : clean === "absent" ? "#fee2e2" : "#f1f5f9",
    color: clean === "present" ? "#15803d" : clean === "absent" ? "#b91c1c" : "#64748b",
  };
};

const presentBtnStyle = (status) => ({
  backgroundColor: status === "Present" ? "#15803d" : "#e2e8f0",
  color: status === "Present" ? "#ffffff" : "#334155",
  border: "none",
  padding: "6px 14px",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "8px",
  fontWeight: "bold",
});

const absentBtnStyle = (status) => ({
  backgroundColor: status === "Absent" ? "#b91c1c" : "#e2e8f0",
  color: status === "Absent" ? "#ffffff" : "#334155",
  border: "none",
  padding: "6px 14px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
});

const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px", backgroundColor: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" };
const headerRowStyle = { backgroundColor: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" };
const rowStyle = { borderBottom: "1px solid #e2e8f0" };
const cellStyle = { padding: "12px 16px" };