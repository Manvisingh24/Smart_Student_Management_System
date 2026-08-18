const db = require("../database/db");

// Get all attendance records
const getAllAttendance = (req, res) => {
    const sql = `
        SELECT
            attendance.id,
            attendance.rollNo,
            students.name,
            attendance.date,
            attendance.status
        FROM attendance
        JOIN students
        ON attendance.rollNo = students.rollNo
        ORDER BY attendance.date DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error fetching attendance:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch attendance"
            });
        }

        res.json({
            success: true,
            data: rows
        });
    });
};


// Mark attendance
const markAttendance = (req, res) => {
    const { rollNo, date, status } = req.body;

    if (!rollNo || !date || !status) {
        return res.status(400).json({
            success: false,
            message: "Roll number, date and status are required"
        });
    }

    if (status !== "Present" && status !== "Absent") {
        return res.status(400).json({
            success: false,
            message: "Status must be Present or Absent"
        });
    }

    // First check whether the student exists
    const studentSql = "SELECT * FROM students WHERE rollNo = ?";

    db.get(studentSql, [rollNo], (err, student) => {
        if (err) {
            console.error("Error checking student:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to check student"
            });
        }

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const sql = `
            INSERT INTO attendance (rollNo, date, status)
            VALUES (?, ?, ?)
        `;

        db.run(sql, [rollNo, date, status], function(err) {
            if (err) {
                console.error("Error marking attendance:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to mark attendance"
                });
            }

            res.status(201).json({
                success: true,
                message: "Attendance marked successfully!",
                data: {
                    attendanceId: this.lastID
                }
            });
        });
    });
};


module.exports = {
    getAllAttendance,
    markAttendance
};