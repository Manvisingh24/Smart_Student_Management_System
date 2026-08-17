import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

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
            {students.map((student) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Students;