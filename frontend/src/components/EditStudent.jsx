import { useState } from "react";

function EditStudent({ student, onStudentUpdated, onCancel }) {
  const [name, setName] = useState(student.name);
  const [age, setAge] = useState(student.age);
  const [course, setCourse] = useState(student.course);
  const [marks, setMarks] = useState(student.marks);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/students/${student.rollNo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            age,
            course,
            marks,
          }),
        }
      );

      const data = await response.json();

      console.log("Update response:", data);

      if (response.ok) {
        onStudentUpdated();
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div>
      <h2>Edit Student</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label>Roll No.</label>
          <input
            type="text"
            value={student.rollNo}
            disabled
          />
        </div>

        <div>
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div>
          <label>Course</label>
          <input
            type="text"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          />
        </div>

        <div>
          <label>Marks</label>
          <input
            type="number"
            value={marks}
            onChange={(event) => setMarks(event.target.value)}
          />
        </div>

        <button type="submit">
          Update Student
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditStudent;