import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  return (
    <main className="dashboard">
      <h1>Students</h1>

      <p>Manage student information here.</p>

      <div>
        {students.map((student) => (
          <div key={student.rollNo}>
            <h3>{student.name}</h3>
            <p>Roll No: {student.rollNo}</p>
            <p>Age: {student.age}</p>
            <p>Course: {student.course}</p>
            <p>Marks: {student.marks}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Students;