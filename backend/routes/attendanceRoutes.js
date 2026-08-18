const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
    getAllAttendance,
    markAttendance
} = require("../controllers/attendanceController");

// GET all attendance records
router.get("/", authMiddleware, getAllAttendance);

// POST attendance
router.post(
    "/",
    authMiddleware,
    authorizeRole("admin"),
    markAttendance
);

module.exports = router;