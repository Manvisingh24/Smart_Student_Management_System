const db = require("../database/db");

// GET /api/attendance
exports.getAllAttendance = (req, res) => {
  const query = `SELECT * FROM attendance ORDER BY date DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching attendance:", err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
    res.status(200).json({ success: true, data: rows });
  });
};

// POST /api/attendance
exports.markAttendance = (req, res) => {
  const { studentId, rollNo, date, status } = req.body;

  if (!status || (!studentId && !rollNo)) {
    return res.status(400).json({
      success: false,
      message: "Please provide studentId (or rollNo), date, and status.",
    });
  }

  const attendanceDate = date || new Date().toISOString().split("T")[0];

  // 1. Insert attendance log
  const insertQuery = `
    INSERT INTO attendance (student_id, rollNo, date, status)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [studentId || null, rollNo || null, attendanceDate, status],
    function (err) {
      if (err) {
        console.error("Error logging attendance:", err.message);
        return res.status(500).json({ success: false, message: err.message });
      }

      // 2. Automatically recalculate and update attendancePercentage in students table
      const targetIdentifier = studentId ? "id = ?" : "rollNo = ?";
      const targetVal = studentId || rollNo;

      const updateStudentQuery = `
        UPDATE students
        SET attendancePercentage = (
          SELECT ROUND(
            (COUNT(CASE WHEN LOWER(status) = 'present' THEN 1 END) * 100.0) / COUNT(*)
          )
          FROM attendance
          WHERE student_id = ? OR rollNo = ?
        )
        WHERE ${targetIdentifier}
      `;

      db.run(
        updateStudentQuery,
        [targetVal, targetVal, targetVal],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating student aggregate attendance:", updateErr.message);
          }

          res.status(201).json({
            success: true,
            message: "Attendance marked and student percentage updated successfully!",
          });
        }
      );
    }
  );
};