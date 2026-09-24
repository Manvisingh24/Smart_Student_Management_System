import { useEffect, useState } from "react";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");

  // Fetch all students
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Students:", data);

      if (response.ok) {
        setStudents(data.data);
      } else {
        console.error("Failed to fetch students:", data.message);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Fetch existing attendance
  const fetchAttendance = async (selectedDate) => {
    const token = localStorage.getItem("token");

    if (!selectedDate) {
      setAttendance({});
      return;
    }

    try {
      const response = await fetch(
      `http://localhost:3000/api/attendance?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Attendance for", selectedDate, ":", data);

      if (response.ok) {
        const attendanceMap = {};

        data.data.forEach((record) => {
          attendanceMap[record.rollNo] = record.status;
        });

        setAttendance(attendanceMap);
      } else {
        console.error("Failed to fetch attendance:", data.message);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // Run when page opens
  useEffect(() => {
    fetchStudents();
  }, []);

  // Change attendance status for one student
  const handleStatusChange = (rollNo, status) => {
    setAttendance((previous) => ({
      ...previous,
      [rollNo]: status,
    }));
  };

  // Save attendance
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a date.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      for (const student of students) {
        const status = attendance[student.rollNo] || "Absent";

        const response = await fetch("http://localhost:3000/api/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rollNo: student.rollNo,
            date,
            status,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(
            `Failed for Roll No. ${student.rollNo}: ${
              data.message || "Something went wrong"
            }`
          );
          return;
        }
      }

      alert("Attendance saved successfully!");

      fetchAttendance(date);

    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Something went wrong while saving attendance.");
    }
  };

  return (
    <main className="dashboard">
      <h1>Attendance</h1>

      <p>Mark attendance for all students.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Date</label>

          <input
            type="date"
            value={date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              const selectedDate = e.target.value;

              setDate(selectedDate);
              fetchAttendance(selectedDate);
            }}
          />
        </div>

        <h2>Student Attendance</h2>

        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Attendance</th>
              </tr>
            </thead>
            
            <tbody>
              {[...students]
                .sort((a, b) => a.rollNo - b.rollNo)
                .map((student) => (
                  <tr key={student.rollNo}>
                    <td>{student.rollNo}</td>

                    <td>{student.name}</td>

                    <td>
                      <select
                        value={attendance[student.rollNo] || "Absent"}
                        onChange={(e) =>
                          handleStatusChange(
                            student.rollNo,
                            e.target.value
                          )
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <button type="submit">Save Attendance</button>
      </form>
    </main>
  );
}

export default Attendance;