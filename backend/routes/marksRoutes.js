const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
  getAllSubjects,
  addSubject,
  getMarks,
  addOrUpdateMarks,
} = require("../controllers/marksController");

// Subject routes
router.get("/subjects", authMiddleware, getAllSubjects);
router.post("/subjects", authMiddleware, authorizeRole("admin"), addSubject);

// Marks routes
router.get("/", authMiddleware, getMarks);
router.post("/", authMiddleware, authorizeRole("admin"), addOrUpdateMarks);

module.exports = router;