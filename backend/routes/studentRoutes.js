const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

// ----------------------------------------------------
// 1. STUDENT DIRECTORY (GET, POST, PUT, DELETE)
// ----------------------------------------------------

// GET /api/students - Directory list with overall attendance & marks
router.get("/", authMiddleware, (req, res) => {
  const query = `
    SELECT 
      rowid AS id,
      rollNo,
      name,
      course,
      COALESCE(year, '4th Year') AS year,
      COALESCE(email, LOWER(REPLACE(name, ' ', '')) || '@college.edu') AS email,
      COALESCE(marks, 0) AS avgMarks,
      COALESCE(attendancePercentage, 0) AS attendancePercentage
    FROM students
    ORDER BY CAST(rollNo AS INTEGER) ASC, rowid ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching students:", err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
    res.status(200).json({ success: true, data: rows || [] });
  });
});

// POST /api/students - Add new student
router.post("/", authMiddleware, (req, res) => {
  const { rollNo, name, course, year, email } = req.body;

  if (!rollNo || !name || !course) {
    return res.status(400).json({ success: false, message: "Roll No, Name, and Course are required." });
  }

  const insertQuery = `
    INSERT INTO students (rollNo, name, course, year, email, marks, attendancePercentage)
    VALUES (?, ?, ?, ?, ?, 0, 0)
  `;

  db.run(insertQuery, [rollNo, name, course, year || '4th Year', email], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ success: false, message: "A student with this Roll No already exists." });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
    res.status(201).json({ success: true, message: "Student added successfully!" });
  });
});

// PUT /api/students/:rollNo - Update student details
router.put("/:rollNo", authMiddleware, (req, res) => {
  const { rollNo } = req.params;
  const { name, course, year, email, marks } = req.body;

  const updateQuery = `
    UPDATE students
    SET name = COALESCE(?, name),
        course = COALESCE(?, course),
        year = COALESCE(?, year),
        email = COALESCE(?, email),
        marks = COALESCE(?, marks)
    WHERE rollNo = ?
  `;

  db.run(updateQuery, [name, course, year, email, marks, rollNo], function (err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, message: "Student record updated successfully!" });
  });
});

// DELETE /api/students/:rollNo - Delete student and linked attendance records
router.delete("/:rollNo", authMiddleware, (req, res) => {
  const { rollNo } = req.params;

  db.serialize(() => {
    db.run(`DELETE FROM attendance WHERE rollNo = ?`, [rollNo]);
    db.run(`DELETE FROM students WHERE rollNo = ?`, [rollNo], function (err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(200).json({ success: true, message: "Student removed successfully!" });
    });
  });
});

// ----------------------------------------------------
// 2. DAILY ATTENDANCE MANAGEMENT
// ----------------------------------------------------

// GET /api/students/attendance/daily - Fetch single date attendance
router.get("/attendance/daily", authMiddleware, (req, res) => {
  const targetDate = req.query.date || new Date().toISOString().split("T")[0];

  const query = `
    SELECT 
      s.rollNo,
      s.name,
      s.course,
      COALESCE(s.year, '4th Year') AS year,
      COALESCE(a.status, 'Not Marked') AS status
    FROM students s
    LEFT JOIN attendance a ON s.rollNo = a.rollNo AND a.date = ?
    ORDER BY CAST(s.rollNo AS INTEGER) ASC
  `;

  db.all(query, [targetDate], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, date: targetDate, data: rows || [] });
  });
});

// POST /api/students/attendance/lock-daily - Lock daily attendance & update overall %
router.post("/attendance/lock-daily", authMiddleware, (req, res) => {
  const { date, records } = req.body;

  if (!date || !records || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: "Date and valid records array required." });
  }

  const checkLockQuery = `SELECT COUNT(*) as count FROM attendance WHERE date = ?`;
  db.get(checkLockQuery, [date], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (row && row.count > 0) {
      return res.status(400).json({ success: false, message: "Attendance for this date is already saved and locked." });
    }

    db.serialize(() => {
      const stmt = db.prepare(`INSERT INTO attendance (rollNo, date, status) VALUES (?, ?, ?)`);
      records.forEach((rec) => {
        stmt.run([rec.rollNo, date, rec.status]);
      });
      stmt.finalize();

      // Recalculate overall attendance percentage for each student
      db.run(
        `UPDATE students 
         SET attendancePercentage = (
           SELECT ROUND((COUNT(CASE WHEN LOWER(status) = 'present' THEN 1 END) * 100.0) / COUNT(*))
           FROM attendance
           WHERE rollNo = students.rollNo
         )`
      );

      res.status(200).json({ success: true, message: "Attendance locked and saved successfully!" });
    });
  });
});

// ----------------------------------------------------
// 3. ANALYTICS & RISK PREDICTION
// ----------------------------------------------------

// GET /api/students/analytics/monthly - Fetch complete monthly average analytics
router.get("/analytics/monthly", authMiddleware, (req, res) => {
  const monthStr = req.query.month || new Date().toISOString().slice(0, 7);

  const monthlyQuery = `
    SELECT 
      s.rollNo,
      s.name,
      s.course,
      COALESCE(s.year, '4th Year') AS year,
      COUNT(a.id) AS totalClasses,
      COUNT(CASE WHEN LOWER(a.status) = 'present' THEN 1 END) AS totalPresent,
      COALESCE(
        ROUND((COUNT(CASE WHEN LOWER(a.status) = 'present' THEN 1 END) * 100.0) / NULLIF(COUNT(a.id), 0)),
        0
      ) AS monthlyAverage
    FROM students s
    LEFT JOIN attendance a 
      ON s.rollNo = a.rollNo 
     AND (a.date LIKE ? || '%')
    GROUP BY s.rollNo, s.name, s.course, s.year
    ORDER BY CAST(s.rollNo AS INTEGER) ASC
  `;

  db.all(monthlyQuery, [monthStr], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, month: monthStr, data: rows || [] });
  });
});

module.exports = router;