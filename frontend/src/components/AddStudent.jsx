import { useState } from "react";

function AddStudent({ onStudentAdded }) { 
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Form submitted");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3000/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            rollNo,
            age,
            course,
            marks,
          }),
        }
      );

      const data = await response.json();

      console.log("Server response:", data);

      if (response.ok) {
        setName("");
        setRollNo("");
        setAge("");
        setCourse("");
        setMarks("");

        onStudentAdded();
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Add Student</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Roll No."
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />

        <button type="submit">
          Add Student
        </button>
      </form>
    </div>
  );
}

export default AddStudent;