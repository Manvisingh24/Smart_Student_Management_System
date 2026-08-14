import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>

        <li>
          <Link to="/students">Students</Link>
        </li>

        <li>Attendance</li>
        <li>Marks</li>
        <li>Analytics</li>
      </ul>
    </aside>
  );
}

export default Sidebar;