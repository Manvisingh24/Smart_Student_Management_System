import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Login from "./pages/Login";
import Attendance from "./components/Attendance";
import Marks from "./components/Marks";
import Analytics from "./components/Analytics";
import StudentDashboard from "./components/StudentDashboard";
import NotFound from "./components/NotFound";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Student Portal (Standalone Page without Admin Sidebar) */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Main application */}
        <Route
          path="*"
          element={
            <div className="app">
              <Navbar />

              <div className="layout">
                <Sidebar />

                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/marks" element={<Marks />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;