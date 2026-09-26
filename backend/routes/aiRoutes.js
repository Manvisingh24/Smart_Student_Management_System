const express = require("express");
const router = express.Router();
const { generateStudentInsights } = require("../services/aiService");
const { verifyToken } = require("../middleware/authMiddleware"); // Adjust path/name to match your middleware

// Protect route with JWT verification
router.post("/insights", verifyToken, async (req, res) => {
  try {
    const { studentData } = req.body;

    const payload = studentData || {
      name: req.user?.name || "Student",
      rollNo: req.user?.rollNo || "N/A",
      marks: req.body?.marks || []
    };

    const insights = await generateStudentInsights(payload);
    
    return res.status(200).json({ 
      success: true, 
      insights 
    });
  } catch (error) {
    console.error("AI Insights Endpoint Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to generate AI insights.", 
      error: error.message 
    });
  }
});

module.exports = router;