import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <h1 style={{ fontSize: "3rem", color: "#e74c3c" }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link 
        to="/" 
        style={{
          display: "inline-block",
          marginTop: "15px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px"
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}