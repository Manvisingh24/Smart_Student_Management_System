import React from "react";

export default function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  const typeStyles = {
    success: { backgroundColor: "#d4edda", color: "#155724", borderColor: "#c3e6cb" },
    error: { backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" },
    info: { backgroundColor: "#d1ecf1", color: "#0c5460", borderColor: "#bee5eb" },
  };

  return (
    <div
      style={{
        padding: "12px 20px",
        borderRadius: "6px",
        border: "1px solid",
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...typeStyles[type],
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            marginLeft: "15px",
            color: "inherit",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}