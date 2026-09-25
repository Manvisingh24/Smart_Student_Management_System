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

        <li>
          <Link to="/attendance">Attendance</Link>
        </li>

        {/* Wrapped Marks in a Link component */}
        <li>
          <Link to="/marks">Marks</Link>
        </li>

        <li>
          <Link to="/analytics">Analytics</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;