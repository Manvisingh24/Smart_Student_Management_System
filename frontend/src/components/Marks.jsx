import React, { useState, useEffect, useCallback } from "react";

export default function Marks() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Subject Form State
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        const studentList = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.students)
          ? result.students
          : [];
        setStudents(studentList);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }, [token]);

  // Fetch all subjects
  const fetchSubjects = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/marks/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const subList = data.data || [];
        setSubjects(subList);
        if (subList.length > 0 && !selectedSubject) {
          setSelectedSubject(subList[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  }, [token, selectedSubject]);

  // Fetch existing marks for selected subject
  const fetchMarksForSubject = useCallback(
    async (subjectId) => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/marks?subjectId=${subjectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const loadedMarks = {};
          data.data.forEach((item) => {
            loadedMarks[item.rollNo] = item.marksObtained;
          });
          setMarksData(loadedMarks);
        } else {
          setMarksData({});
        }
      } catch (err) {
        console.error("Error fetching marks for subject:", err);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, [fetchStudents, fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      fetchMarksForSubject(selectedSubject);
    }
  }, [selectedSubject, fetchMarksForSubject]);

  // Handle new subject addition
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    try {
      const res = await fetch("http://localhost:3000/api/marks/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: newCode, name: newName }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Subject added successfully!", type: "success" });
        setNewCode("");
        setNewName("");
        fetchSubjects();
      } else {
        setMessage({
          text: data.message || "Failed to add subject",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({ text: "Server error adding subject", type: "error" });
    }
  };

  // Handle score change in table
  const handleScoreChange = (rollNo, val) => {
    setMarksData((prev) => ({
      ...prev,
      [rollNo]: val,
    }));
  };

  // Save marks for all students using parallel Promise.all requests
  const handleSaveMarks = async () => {
    if (!selectedSubject) {
      alert("Please select a subject first.");
      return;
    }

    setLoading(true);

    const savePromises = students
      .filter(
        (student) =>
          marksData[student.rollNo] !== undefined &&
          marksData[student.rollNo] !== ""
      )
      .map((student) =>
        fetch("http://localhost:3000/api/marks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rollNo: student.rollNo,
            subjectId: Number(selectedSubject),
            marksObtained: Number(marksData[student.rollNo]),
            maxMarks: 100,
          }),
        }).then((res) => res.json())
      );

    try {
      const results = await Promise.all(savePromises);
      const successCount = results.filter((r) => r.success).length;

      setMessage({
        text: `Saved marks for ${successCount} student(s) successfully!`,
        type: "success",
      });

      fetchMarksForSubject(selectedSubject);
    } catch (err) {
      console.error("Error saving marks:", err);
      setMessage({ text: "Failed to save marks.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Marks Management</h2>

      {message.text && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            backgroundColor:
              message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {message.text}
        </div>
      )}

      {/* --- ADD SUBJECT SECTION --- */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h4>Add New Subject</h4>
        <form onSubmit={handleAddSubject} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Subject Code (e.g. CS301)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            required
            style={{ padding: "8px", flex: "1" }}
          />
          <input
            type="text"
            placeholder="Subject Name (e.g. DBMS)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ padding: "8px", flex: "2" }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Subject
          </button>
        </form>
      </div>

      {/* --- MARKS ENTRY SECTION --- */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "15px", alignItems: "center" }}>
        <label><strong>Select Subject:</strong></label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}
        >
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.code} - {sub.name}
            </option>
          ))}
        </select>
      </div>

      {students.length === 0 ? (
        <p>No students found. Please add students first.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }} border="1">
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "8px" }}>Roll No</th>
              <th style={{ padding: "8px" }}>Name</th>
              <th style={{ padding: "8px" }}>Marks Obtained (out of 100)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.rollNo || student.id}>
                <td style={{ padding: "8px", textAlign: "center" }}>{student.rollNo}</td>
                <td style={{ padding: "8px" }}>{student.name}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      marksData[student.rollNo] !== undefined
                        ? marksData[student.rollNo]
                        : ""
                    }
                    onChange={(e) =>
                      handleScoreChange(student.rollNo, e.target.value)
                    }
                    placeholder="e.g. 85"
                    style={{ padding: "6px", width: "100px", textAlign: "center" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {students.length > 0 && (
        <button
          onClick={handleSaveMarks}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving Marks..." : "Save All Marks"}
        </button>
      )}
    </div>
  );
}