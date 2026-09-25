import React from "react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
      <div className="spinner" style={spinnerStyle}></div>
      <p style={{ marginTop: "12px", color: "#555", fontSize: "0.95rem" }}>{message}</p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const spinnerStyle = {
  width: "36px",
  height: "36px",
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};