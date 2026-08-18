import { useEffect, useState } from "react";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");

  const fetchAttendance = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/attendance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("Attendance list:", data);

    if (response.ok) {
      setAttendance(data.data);
    } else {
      console.error("Failed to fetch attendance:", data.message);
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);
  }
};

useEffect(() => {
  fetchAttendance();
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rollNo,
        date,
        status,
      }),
    });

    const data = await response.json();

    console.log("Attendance response:", data);

    if (!response.ok) {
      alert(data.message || "Failed to mark attendance");
      return;
    }

    alert("Attendance marked successfully!");
    fetchAttendance();

  } catch (error) {
    console.error("Error marking attendance:", error);
    alert("Something went wrong");
  }
};


  return (
    <main className="dashboard">
      <h1>Attendance</h1>

      <p>Manage student attendance here.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Roll No.</label>
          <input
            type="number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Enter roll number"
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button type="submit">Mark Attendance</button>
            </form>

            <h2>Attendance Records</h2>

            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Roll No.</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                    {attendance.map((record) => (
                        <tr key={record.id}>
                            <td>{record.rollNo}</td>
                            <td>{record.name}</td>
                            <td>{record.date}</td>
                            <td>{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>    
    </main>
  );
}

export default Attendance;