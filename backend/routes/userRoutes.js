const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
    updateUsername
} = require("../controllers/userController");

// Only admin can update usernames
router.put(
    "/:id",
    authMiddleware,
    authorizeRole("admin"),
    updateUsername
);

module.exports = router;