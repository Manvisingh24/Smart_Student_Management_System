const db = require("../database/db");

const getAllStudents = (req, res) => {

    console.log("Logged in user:", req.user);
    
    const sql = "SELECT * FROM students";

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error fetching students:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch students"
            });
        }

        res.json({
            success: true,
            data: rows
        });
    });
};

module.exports = {
    getAllStudents
};

const createStudent = (req, res) => {
    const { rollNo, name, age, course, marks } = req.body;

    if (!rollNo || !name || !age || !course || marks === undefined) {
        return res.status(400).json({
            success: false,
            message: "All student fields are required"
        });
    }

    if (rollNo <= 0) {
        return res.status(400).json({
            success: false,
            message: "Roll number must be positive"
        });
    }

    if (age <= 0) {
        return res.status(400).json({
            success: false,
            message: "Age must be positive"
        });
    }

    if (marks < 0 || marks > 100) {
        return res.status(400).json({
            success: false,
            message: "Marks must be between 0 and 100"
        });
    }

    const sql = `
        INSERT INTO students (rollNo, name, age, course, marks)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [rollNo, name, age, course, marks], function(err) {
        if (err) {
            console.error("Error adding student:", err.message);

            if (
                err.message.includes("UNIQUE constraint failed") ||
                err.message.includes("PRIMARY KEY constraint failed")
            ) {
                return res.status(409).json({
                    success: false,
                    message: `Student with roll number ${rollNo} already exists`
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to add student"
            });
        }

        res.status(201).json({
            success: true,
            message: "Student added successfully!",
             data: {
                studentId: this.lastID
            }
        });
    });
};

const getStudentByRollNo = (req, res) => {
    const rollNo = req.params.rollNo;

    const sql = "SELECT * FROM students WHERE rollNo = ?";

    db.get(sql, [rollNo], (err, row) => {
        if (err) {
            console.error("Error searching student:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to search student"
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            data: row
        });
    });
};


const updateStudent = (req, res) => {
    const rollNo = req.params.rollNo;
    const { name, age, course, marks } = req.body;

    if (!name || !age || !course || marks === undefined) {
        return res.status(400).json({
            success: false,
            message: "All student fields are required"
        });
    }

    if (age <= 0) {
        return res.status(400).json({
            success: false,
            message: "Age must be positive"
        });
    }

    if (marks < 0 || marks > 100) {
        return res.status(400).json({
            success: false,
            message: "Marks must be between 0 and 100"
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, age = ?, course = ?, marks = ?
        WHERE rollNo = ?
    `;

    db.run(sql, [name, age, course, marks, rollNo], function(err) {
        if (err) {
            console.error("Error updating student:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to update student"
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully!"
        });
    });
};


const deleteStudent = (req, res) => {
    const rollNo = req.params.rollNo;

    const sql = "DELETE FROM students WHERE rollNo = ?";

    db.run(sql, [rollNo], function(err) {
        if (err) {
            console.error("Error deleting student:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to delete student"
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully!"
        });
    });
};

module.exports = {
    getAllStudents,
    createStudent,
    getStudentByRollNo,
    updateStudent,
    deleteStudent
};