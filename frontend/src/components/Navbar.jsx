import React from "react";

function Navbar() {
  const handleLogout = () => {
    // 1. Remove stored session token & user details
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Redirect back to login page
    window.location.href = "/login";
  };

  return (
    <nav className="navbar" style={navStyle}>
      <h2 style={{ margin: 0 }}>Smart Student Management System</h2>
      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
    </nav>
  );
}

// Inline styling for quick layout
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  backgroundColor: "#1e293b",
  color: "#ffffff",
};

const logoutButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#ef4444",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Navbar;