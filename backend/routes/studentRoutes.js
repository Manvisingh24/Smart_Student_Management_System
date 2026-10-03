const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

// Normalize incoming date formats (DD-MM-YYYY or YYYY-MM-DD) to ISO YYYY-MM-DD
const normalizeDate = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts[0].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr;
};

// ==========================================
// 1. STUDENT CRUD ROUTES (With Year Filter)
// ==========================================

// GET /api/students - Fetch students (optional ?year=4th%20Year filter)
router.get("/", authMiddleware, (req, res) => {
  const { year } = req.query;
  let query = `SELECT * FROM students`;
  let params = [];

  if (year && year !== "All") {
    query += ` WHERE year = ?`;
    params.push(year);
  }

  query += ` ORDER BY CAST(rollNo AS INTEGER) ASC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, data: rows || [] });
  });
});

// POST /api/students - Add student with explicit Year classification
router.post("/", authMiddleware, (req, res) => {
  const { rollNo, name, course, year, attendancePercentage } = req.body;
  if (!rollNo || !name) {
    return res.status(400).json({ success: false, message: "Roll No and Name are required." });
  }

  const query = `INSERT INTO students (rollNo, name, course, year, attendancePercentage) VALUES (?, ?, ?, ?, ?)`;
  db.run(
    query,
    [rollNo, name, course || "B.Tech", year || "4th Year", attendancePercentage || 0],
    function (err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({ success: true, message: "Student added successfully!" });
    }
  );
});

// PUT /api/students/:rollNo - Update student details
router.put("/:rollNo", authMiddleware, (req, res) => {
  const { name, course, year, attendancePercentage } = req.body;
  const { rollNo } = req.params;

  const query = `UPDATE students SET name = ?, course = ?, year = ?, attendancePercentage = ? WHERE CAST(rollNo AS TEXT) = CAST(? AS TEXT)`;
  db.run(query, [name, course, year, attendancePercentage, rollNo], function (err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, message: "Student updated successfully!" });
  });
});

// DELETE /api/students/:rollNo - Delete student
router.delete("/:rollNo", authMiddleware, (req, res) => {
  const { rollNo } = req.params;
  db.run(`DELETE FROM students WHERE CAST(rollNo AS TEXT) = CAST(? AS TEXT)`, [rollNo], function (err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, message: "Student deleted successfully!" });
  });
});

// ==========================================
// 2. ATTENDANCE & STRICT LOCKING
// ==========================================

// GET /api/students/attendance/daily - Fetch daily status with year filter
router.get("/attendance/daily", authMiddleware, (req, res) => {
  const formattedDate = normalizeDate(req.query.date);
  const { year } = req.query;

  let query = `
    SELECT 
      s.rollNo,
      s.name,
      s.course,
      COALESCE(s.year, '4th Year') AS year,
      COALESCE(a.status, 'Not Marked') AS status
    FROM students s
    LEFT JOIN attendance a 
      ON CAST(s.rollNo AS TEXT) = CAST(a.rollNo AS TEXT) 
     AND a.date = ?
  `;
  let params = [formattedDate];

  if (year && year !== "All") {
    query += ` WHERE s.year = ?`;
    params.push(year);
  }

  query += ` ORDER BY CAST(s.rollNo AS INTEGER) ASC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    // Check if the overall batch for this date is locked
    db.get(`SELECT COUNT(*) as count FROM attendance WHERE date = ?`, [formattedDate], (lockErr, lockRow) => {
      const isLocked = lockRow ? lockRow.count > 0 : false;
      res.status(200).json({ success: true, date: formattedDate, isLocked, data: rows || [] });
    });
  });
});

// POST /api/students/attendance/lock-daily - Save & Lock batch attendance
router.post("/attendance/lock-daily", authMiddleware, (req, res) => {
  const { date, records } = req.body;
  if (!date || !records || !Array.isArray(records)) {
    return res.status(400).json({ success: false, message: "Date and records required." });
  }

  const formattedDate = normalizeDate(date);

  db.get(`SELECT COUNT(*) as count FROM attendance WHERE date = ?`, [formattedDate], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (row && row.count > 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance for this date is already locked and cannot be edited."
      });
    }

    db.serialize(() => {
      const stmt = db.prepare(`INSERT INTO attendance (rollNo, date, status) VALUES (?, ?, ?)`);
      records.forEach((rec) => {
        stmt.run([rec.rollNo, formattedDate, rec.status]);
      });
      stmt.finalize();

      // Recalculate overall student attendance percentage
      db.run(
        `UPDATE students 
         SET attendancePercentage = (
           SELECT COALESCE(ROUND((COUNT(CASE WHEN LOWER(TRIM(status)) = 'present' THEN 1 END) * 100.0) / NULLIF(COUNT(*), 0)), 0)
           FROM attendance
           WHERE CAST(rollNo AS TEXT) = CAST(students.rollNo AS TEXT)
         )`
      );

      res.status(200).json({ success: true, message: "Attendance locked successfully!" });
    });
  });
});

// ==========================================
// 3. MARKS & SUBJECTS
// ==========================================

// GET /api/students/marks - Fetch subject marks
router.get("/marks", authMiddleware, (req, res) => {
  const { year } = req.query;
  let query = `
    SELECT 
      m.id,
      m.rollNo,
      s.name AS studentName,
      COALESCE(s.year, '4th Year') AS year,
      m.subjectName,
      m.marksObtained,
      m.maxMarks
    FROM marks m
    JOIN students s ON CAST(s.rollNo AS TEXT) = CAST(m.rollNo AS TEXT)
  `;
  let params = [];

  if (year && year !== "All") {
    query += ` WHERE s.year = ?`;
    params.push(year);
  }

  query += ` ORDER BY CAST(m.rollNo AS INTEGER) ASC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, data: rows || [] });
  });
});

// POST /api/students/marks - Add/Update student mark
router.post("/marks", authMiddleware, (req, res) => {
  const { rollNo, subjectName, marksObtained, maxMarks } = req.body;

  if (!rollNo || !subjectName || marksObtained === undefined) {
    return res.status(400).json({ success: false, message: "Roll No, Subject, and Marks required." });
  }

  const query = `INSERT INTO marks (rollNo, subjectName, marksObtained, maxMarks) VALUES (?, ?, ?, ?)`;
  db.run(query, [rollNo, subjectName, marksObtained, maxMarks || 100], function (err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(201).json({ success: true, message: "Marks saved successfully!" });
  });
});

// ==========================================
// 4. COMPREHENSIVE ANALYTICS & RISK SCORING
// ==========================================

// GET /api/students/analytics/monthly - Consolidated performance & risk metrics
router.get("/analytics/monthly", authMiddleware, (req, res) => {
  const targetMonth = req.query.month || new Date().toISOString().slice(0, 7);
  const { year } = req.query;

  let params = [targetMonth];
  let yearCondition = "";

  if (year && year !== "All") {
    yearCondition = "WHERE s.year = ?";
    params.push(year);
  }

  const query = `
    SELECT 
      s.rollNo,
      s.name,
      s.course,
      COALESCE(s.year, '4th Year') AS year,
      COALESCE(s.attendancePercentage, 0) AS overallAttendance,
      COUNT(a.id) AS monthlyTotalClasses,
      SUM(CASE WHEN LOWER(TRIM(a.status)) = 'present' THEN 1 ELSE 0 END) AS monthlyTotalPresent,
      CASE 
        WHEN COUNT(a.id) > 0 THEN 
          ROUND((SUM(CASE WHEN LOWER(TRIM(a.status)) = 'present' THEN 1 ELSE 0 END) * 100.0) / COUNT(a.id))
        ELSE 0 
      END AS monthlyAttendance,
      COALESCE(m.avgMarks, 0) AS overallMarksPercentage
    FROM students s
    LEFT JOIN attendance a 
      ON CAST(s.rollNo AS TEXT) = CAST(a.rollNo AS TEXT)
     AND a.date LIKE ? || '%'
    LEFT JOIN (
      SELECT 
        rollNo, 
        ROUND((SUM(marksObtained) * 100.0) / NULLIF(SUM(maxMarks), 0)) AS avgMarks 
      FROM marks 
      GROUP BY rollNo
    ) m ON CAST(s.rollNo AS TEXT) = CAST(m.rollNo AS TEXT)
    ${yearCondition}
    GROUP BY s.rollNo, s.name, s.course
    ORDER BY CAST(s.rollNo AS INTEGER) ASC
  `;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    // Attach performance grades and flags
    const processedData = (rows || []).map((student) => {
      const isAttendanceRisk = student.monthlyAttendance < 40;
      const isMarksRisk = student.overallMarksPercentage < 35;

      const combinedScore = (student.monthlyAttendance + student.overallMarksPercentage) / 2;
      let grade = "F";
      if (combinedScore >= 85) grade = "A+";
      else if (combinedScore >= 75) grade = "A";
      else if (combinedScore >= 65) grade = "B";
      else if (combinedScore >= 50) grade = "C";
      else if (combinedScore >= 35) grade = "D";

      return {
        ...student,
        grade,
        isAttendanceRisk,
        isMarksRisk,
        isOverallRisk: isAttendanceRisk || isMarksRisk
      };
    });

    res.status(200).json({ success: true, month: targetMonth, data: processedData });
  });
});

module.exports = router;