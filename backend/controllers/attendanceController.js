const db = require("../database/db");

// Get all attendance records
const getAllAttendance = (req, res) => {
    const { date } = req.query;

    let sql = `
        SELECT
            attendance.id,
            attendance.rollNo,
            students.name,
            attendance.date,
            attendance.status
        FROM attendance
        JOIN students
        ON attendance.rollNo = students.rollNo
    `;

    let params = [];

    if (date) {
        sql += " WHERE attendance.date = ?";
        params.push(date);
    }

    sql += " ORDER BY attendance.rollNo ASC";

    db.all(sql, params, (err, rows) => {
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

    const today = new Date().toISOString().split("T")[0];

    if (date > today) {
        return res.status(400).json({
            success: false,
            message: "Attendance cannot be marked for a future date"
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

        // Check if attendance for this student + date already exists
        const checkSql = "SELECT * FROM attendance WHERE rollNo = ? AND date = ?";

        db.get(checkSql, [rollNo, date], (err, existingRecord) => {
            if (err) {
                console.error("Error checking existing attendance:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to check existing attendance"
                });
            }

            if (existingRecord) {
                const updateSql = "UPDATE attendance SET status = ? WHERE id = ?";

                db.run(updateSql, [status, existingRecord.id], function (err) {
                    if (err) {
                        console.error("Error updating attendance:", err.message);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to update attendance"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        message: "Attendance updated successfully!",
                        data: { attendanceId: existingRecord.id }
                    });
                });
            } else {
                const insertSql = `
                    INSERT INTO attendance (rollNo, date, status)
                    VALUES (?, ?, ?)
                `;

                db.run(insertSql, [rollNo, date, status], function (err) {
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
                        data: { attendanceId: this.lastID }
                    });
                });
            }
        });
    });
};


module.exports = {
    getAllAttendance,
    markAttendance
};