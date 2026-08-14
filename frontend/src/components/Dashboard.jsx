function Dashboard() {
  return (
    <main className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the Student Management Dashboard</p>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Students</h3>
          <p>120</p>
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