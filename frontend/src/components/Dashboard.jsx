import { useEffect, useState } from "react";

function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:3000/api/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Students data:", data);

        if (response.ok) {
          setTotalStudents(data.data.length);
        } else {
          console.error(
            "Failed to fetch students:",
            data.message || data.error
          );
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchTotalStudents();
  }, []);

  return (
    <main className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the Student Management Dashboard</p>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Students</h3>
          <p>{totalStudents}</p>
        </div>

        <div className="card">
          <h3>Average Marks</h3>
          <p>76%</p>
        </div>

        <div className="card">
          <h3>Attendance</h3>
          <p>89%</p>
        </div>

        <div className="card">
          <h3>Performance</h3>
          <p>Improving</p>
        </div>

      </div>
    </main>
  );
}

export default Dashboard;