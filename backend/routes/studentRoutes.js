const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllStudents,
    createStudent,
    getStudentByRollNo,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");


// GET all students
router.get("/", authMiddleware, getAllStudents);

// POST a new student
router.post("/", createStudent);


// GET student by roll number
router.get("/:rollNo", getStudentByRollNo);


// PUT update student
router.put("/:rollNo", updateStudent);


// DELETE student
router.delete("/:rollNo", deleteStudent);


module.exports = router;