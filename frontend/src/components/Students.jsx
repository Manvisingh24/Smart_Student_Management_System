import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Search & Filter state for Phase 5 requirements
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");

  const fetchStudents = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStudents(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  const handleDelete = async (rollNo) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/students/${rollNo}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Delete response:", data);

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Extract unique courses dynamically for the dropdown filter
  const courses = [
    "ALL",
    ...Array.from(
      new Set(students.map((s) => s.course).filter(Boolean))
    ),
  ];

  // Filter students based on search query and course selection
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    const matchesName = student.name ? student.name.toLowerCase().includes(term) : false;
    const matchesRoll = student.rollNo ? String(student.rollNo).toLowerCase().includes(term) : false;
    const matchesSearch = matchesName || matchesRoll;

    const matchesCourse =
      selectedCourse === "ALL" || student.course === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  return (
    <main className="dashboard">
      <h1>Students</h1>

      <p>Manage student information here.</p>

      <AddStudent onStudentAdded={fetchStudents} />

      {editingStudent && (
        <EditStudent
          student={editingStudent}
          onStudentUpdated={() => {
            fetchStudents();
            setEditingStudent(null);
          }}
          onCancel={() => setEditingStudent(null)}
        />
      )}

      {/* --- Phase 5: Search & Filter Controls --- */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          margin: "20px 0",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by Name or Roll No..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: "2",
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{
            flex: "1",
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          {courses.map((course) => (
            <option key={course} value={course}>
              {course === "ALL" ? "All Courses" : course}
            </option>
          ))}
        </select>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Age</th>
              <th>Course</th>
              <th>Marks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "15px" }}>
                  No matching students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.rollNo}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.course}</td>
                  <td>{student.marks}</td>

                  <td>
                    <button onClick={() => setEditingStudent(student)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(student.rollNo)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Students;