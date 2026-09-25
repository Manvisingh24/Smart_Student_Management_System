const express = require("express");
const router = express.Router();
// Import database connection (adjust path if db module is located elsewhere like ../config/db)
const db = require("../db"); 

// GET /api/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    // 1. Get Total Students
    const [students] = await db.query("SELECT COUNT(*) AS total FROM students");
    
    // 2. Calculate Average Attendance %
    const [attendance] = await db.query(
      "SELECT ROUND(AVG(CASE WHEN status = 'Present' THEN 100 ELSE 0 END), 1) AS avgAttendance FROM attendance"
    );

    // 3. Calculate Average Marks
    const [marks] = await db.query("SELECT ROUND(AVG(marksObtained), 1) AS avgMarks FROM marks");

    res.json({
      success: true,
      data: {
        totalStudents: students[0]?.total || 0,
        avgAttendance: attendance[0]?.avgAttendance || 0,
        avgMarks: marks[0]?.avgMarks || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server error fetching stats" });
  }
});

module.exports = router;