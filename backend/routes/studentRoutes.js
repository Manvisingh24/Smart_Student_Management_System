const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

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
router.post("/", authMiddleware, authorizeRole("admin"), createStudent);

// GET student by roll number
router.get("/:rollNo", authMiddleware, getStudentByRollNo);

// PUT update student
router.put("/:rollNo", authMiddleware, authorizeRole("admin"), updateStudent);

// DELETE student
router.delete("/:rollNo", authMiddleware, authorizeRole("admin"), deleteStudent);


module.exports = router;