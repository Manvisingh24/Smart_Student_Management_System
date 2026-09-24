const db = require("../database/db");

// ---------------- SUBJECTS CONTROLLERS ----------------

// Get all subjects
const getAllSubjects = (req, res) => {
  const sql = "SELECT * FROM subjects ORDER BY name ASC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching subjects:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch subjects",
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
};

// Add a new subject
const addSubject = (req, res) => {
  const { code, name } = req.body;

  if (!code || !name) {
    return res.status(400).json({
      success: false,
      message: "Subject code and name are required",
    });
  }

  const sql = "INSERT INTO subjects (code, name) VALUES (?, ?)";

  db.run(sql, [code, name], function (err) {
    if (err) {
      console.error("Error adding subject:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to add subject (code may already exist)",
      });
    }

    res.status(201).json({
      success: true,
      message: "Subject added successfully",
      data: { id: this.lastID, code, name },
    });
  });
};

// ---------------- MARKS CONTROLLERS ----------------

// Get marks (All or filtered by rollNo/subjectId)
const getMarks = (req, res) => {
  const { rollNo, subjectId } = req.query;

  let sql = `
    SELECT 
      marks.id,
      marks.rollNo,
      students.name AS studentName,
      marks.subjectId,
      subjects.code AS subjectCode,
      subjects.name AS subjectName,
      marks.marksObtained,
      marks.maxMarks
    FROM marks
    JOIN students ON marks.rollNo = students.rollNo
    JOIN subjects ON marks.subjectId = subjects.id
  `;

  const params = [];
  const conditions = [];

  if (rollNo) {
    conditions.push("marks.rollNo = ?");
    params.push(rollNo);
  }

  if (subjectId) {
    conditions.push("marks.subjectId = ?");
    params.push(subjectId);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY marks.rollNo ASC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Error fetching marks:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch marks",
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
};

// Save / Update marks (Upsert logic)
const addOrUpdateMarks = (req, res) => {
  const { rollNo, subjectId, marksObtained, maxMarks } = req.body;

  if (!rollNo || !subjectId || marksObtained === undefined) {
    return res.status(400).json({
      success: false,
      message: "Roll number, subject ID, and marks obtained are required",
    });
  }

  const limitMarks = maxMarks || 100;

  if (marksObtained < 0 || marksObtained > limitMarks) {
    return res.status(400).json({
      success: false,
      message: `Marks must be between 0 and ${limitMarks}`,
    });
  }

  // Check existing marks record
  const checkSql = "SELECT * FROM marks WHERE rollNo = ? AND subjectId = ?";

  db.get(checkSql, [rollNo, subjectId], (err, existing) => {
    if (err) {
      console.error("Error checking marks:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to verify marks record",
      });
    }

    if (existing) {
      // Update existing marks
      const updateSql =
        "UPDATE marks SET marksObtained = ?, maxMarks = ? WHERE id = ?";
      db.run(updateSql, [marksObtained, limitMarks, existing.id], function (err) {
        if (err) {
          console.error("Error updating marks:", err.message);
          return res.status(500).json({
            success: false,
            message: "Failed to update marks",
          });
        }

        res.json({
          success: true,
          message: "Marks updated successfully!",
        });
      });
    } else {
      // Insert new marks
      const insertSql =
        "INSERT INTO marks (rollNo, subjectId, marksObtained, maxMarks) VALUES (?, ?, ?, ?)";
      db.run(
        insertSql,
        [rollNo, subjectId, marksObtained, limitMarks],
        function (err) {
          if (err) {
            console.error("Error saving marks:", err.message);
            return res.status(500).json({
              success: false,
              message: "Failed to save marks",
            });
          }

          res.status(201).json({
            success: true,
            message: "Marks saved successfully!",
            data: { id: this.lastID },
          });
        }
      );
    }
  });
};

module.exports = {
  getAllSubjects,
  addSubject,
  getMarks,
  addOrUpdateMarks,
};