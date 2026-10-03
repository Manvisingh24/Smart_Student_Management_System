import React, { useState, useEffect } from "react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    course: "",
    year: "4th Year",
    email: "",
  });

  // Fetch student list from backend
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/students", {
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
        setStudents(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      rollNo: "",
      name: "",
      course: "",
      year: "4th Year",
      email: "",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      rollNo: student.rollNo,
      name: student.name || "",
      course: student.course || "",
      year: student.year || "4th Year",
      email: student.email || "",
    });
  };

  // Save New Student (POST)
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setIsAddModalOpen(false);
        fetchStudents();
      } else {
        alert(result.message || "Failed to add student.");
      }
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  // Update Existing Student (PUT)
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/students/${editingStudent.rollNo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      if (res.ok && result.success) {
        setEditingStudent(null);
        fetchStudents();
      } else {
        alert(result.message || "Failed to update student details.");
      }
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  // Delete Student (DELETE)
  const handleDeleteStudent = async (rollNo, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name} (Roll No: ${rollNo})?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/students/${rollNo}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        fetchStudents();
      } else {
        alert(result.message || "Failed to delete student.");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading students list...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header and Add Student Trigger */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Students Directory</h2>
        <button onClick={handleOpenAddModal} style={addBtnStyle}>
          + Add New Student
        </button>
      </div>

      {/* Directory Table */}
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th style={cellStyle}>Roll No</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Course</th>
            <th style={cellStyle}>Year</th>
            <th style={cellStyle}>Email ID</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.rollNo} style={rowStyle}>
              <td style={cellStyle}>{student.rollNo}</td>
              <td style={cellStyle}><strong>{student.name}</strong></td>
              <td style={cellStyle}>{student.course || "N/A"}</td>
              <td style={cellStyle}>{student.year || "4th Year"}</td>
              <td style={cellStyle}>{student.email || `${student.name.toLowerCase().replace(/\s+/g, '')}@college.edu`}</td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleOpenEditModal(student)}
                  style={editBtnStyle}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStudent(student.rollNo, student.name)}
                  style={deleteBtnStyle}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal: ADD STUDENT */}
      {isAddModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Add New Student</h3>
            <form onSubmit={handleAddStudent} style={formStyle}>
              <div>
                <label style={labelStyle}>Roll No</label>
                <input type="number" name="rollNo" value={formData.rollNo} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Course</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <input type="text" name="year" value={formData.year} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email ID</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={modalActionsStyle}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" style={saveBtnStyle}>Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: EDIT STUDENT */}
      {editingStudent && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Edit Student Information</h3>
            <form onSubmit={handleUpdateStudent} style={formStyle}>
              <div>
                <label style={labelStyle}>Roll No (Read Only)</label>
                <input type="text" value={formData.rollNo} disabled style={disabledInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Course</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <input type="text" name="year" value={formData.year} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email ID</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={modalActionsStyle}>
                <button type="button" onClick={() => setEditingStudent(null)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" style={saveBtnStyle}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling Objects
const addBtnStyle = { backgroundColor: "#16a34a", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
const editBtnStyle = { backgroundColor: "#2563eb", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginRight: "8px" };
const deleteBtnStyle = { backgroundColor: "#dc2626", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };

const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px", backgroundColor: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" };
const headerRowStyle = { backgroundColor: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" };
const rowStyle = { borderBottom: "1px solid #e2e8f0" };
const cellStyle = { padding: "12px 16px" };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContentStyle = { backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", width: "100%", maxWidth: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };
const formStyle = { display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px", color: "#475569" };
const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" };
const disabledInputStyle = { ...inputStyle, backgroundColor: "#f1f5f9", cursor: "not-allowed" };
const modalActionsStyle = { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" };
const saveBtnStyle = { backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const cancelBtnStyle = { backgroundColor: "#94a3b8", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };