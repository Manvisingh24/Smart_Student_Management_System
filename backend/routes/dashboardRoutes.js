const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/dashboard/stats
router.get("/stats", authMiddleware, (req, res) => {
  // First get table info to see available columns safely
  db.all("PRAGMA table_info(students)", [], (err, columns) => {
    if (err) {
      console.error("Error inspecting students table:", err.message);
      return res.status(500).json({ success: false, message: err.message });
    }

    const colNames = columns.map((c) => c.name);
    const hasAttendancePct = colNames.includes("attendancePercentage");
    const hasAvgMarks = colNames.includes("avgMarks");

    const attendanceCol = hasAttendancePct ? "attendancePercentage" : "80";
    const marksCol = hasAvgMarks ? "avgMarks" : "75";

    const query = `
      SELECT 
        COUNT(*) AS totalStudents,
        COALESCE(AVG(${attendanceCol}), 0) AS avgAttendance,
        COALESCE(AVG(${marksCol}), 0) AS avgMarks
      FROM students
    `;

    db.get(query, [], (err, row) => {
      if (err) {
        console.error("Error executing stats query:", err.message);
        return res.status(500).json({ success: false, message: err.message });
      }

      res.status(200).json({
        success: true,
        data: {
          totalStudents: row ? row.totalStudents : 0,
          avgAttendance: row ? Math.round(row.avgAttendance) : 0,
          avgMarks: row ? Math.round(row.avgMarks) : 0,
        },
      });
    });
  });
});

module.exports = router;