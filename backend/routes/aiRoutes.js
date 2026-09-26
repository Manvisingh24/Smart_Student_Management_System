const express = require("express");
const router = express.Router();
const { generateStudentInsights } = require("../services/aiService");

// POST /api/ai/insights
router.post("/insights", async (req, res) => {
  try {
    const { studentData } = req.body;

    // Fallback if studentData is sent directly or inside req.user
    const payload = studentData || {
      name: req.body?.name || req.user?.name || "Student",
      rollNo: req.body?.rollNo || req.user?.rollNo || "N/A",
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