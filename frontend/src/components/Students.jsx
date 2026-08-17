import AddStudent from "./AddStudent";
import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);

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

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <main className="dashboard">
      <h1>Students</h1>

      <p>Manage student information here.</p>

      <AddStudent onStudentAdded={fetchStudents} />

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Age</th>
              <th>Course</th>
              <th>Marks</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Students;