const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/student-dashboard/:rollNo
router.get("/:rollNo", async (req, res) => {
  const { rollNo } = req.params;

  try {
    // 1. Fetch Student Details
    const [studentRows] = await db.query(
      "SELECT rollNo, name, age, course FROM students WHERE rollNo = ?",
      [rollNo]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const studentInfo = studentRows[0];

    // 2. Fetch Student Attendance Stats
    const [attendanceRows] = await db.query(
      "SELECT status, COUNT(*) as count FROM attendance WHERE rollNo = ? GROUP BY status",
      [rollNo]
    );

    let totalClasses = 0;
    let presentClasses = 0;

    attendanceRows.forEach((row) => {
      totalClasses += row.count;
      if (row.status === "Present") {
        presentClasses += row.count;
      }
    });

    const attendancePercentage = totalClasses > 0
      ? ((presentClasses / totalClasses) * 100).toFixed(1)
      : 0;

    // 3. Fetch Student Marks
    const [marksRows] = await db.query(
      "SELECT subject, marksObtained FROM marks WHERE rollNo = ?",
      [rollNo]
    );

    res.json({
      success: true,
      data: {
        profile: studentInfo,
        attendance: {
          totalClasses,
          presentClasses,
          percentage: attendancePercentage,
        },
        marks: marksRows,
      },
    });
  } catch (error) {
    console.error("Error fetching student dashboard info:", error);
    res.status(500).json({ success: false, message: "Server error loading dashboard" });
  }
});

module.exports = router;