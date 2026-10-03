const db = require("./database/db");

db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_roll_date 
  ON attendance (rollNo, date)
`, (err) => {
  if (err) {
    console.error("Index setup error:", err.message);
  } else {
    console.log("Attendance table index verified successfully!");
  }
  process.exit();
});