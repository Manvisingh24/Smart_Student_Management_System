const db = require("./database/db");

// Function to calculate and update attendance percentage for all students
const runSync = () => {
  const syncQuery = `
    UPDATE students
    SET attendancePercentage = COALESCE(
      (
        SELECT ROUND(
          (COUNT(CASE WHEN LOWER(a.status) = 'present' THEN 1 END) * 100.0) / COUNT(*)
        )
        FROM attendance a
        WHERE a.rollNo = students.rollNo
      ),
      0
    )
  `;

  db.run(syncQuery, [], function (err) {
    if (err) {
      console.error("Sync execution failed:", err.message);
    } else {
      console.log(`Successfully updated attendance for ${this.changes} students!`);
    }

    // Display sample records to confirm
    db.all("SELECT rollNo, name, course, marks, attendancePercentage FROM students", [], (readErr, rows) => {
      if (!readErr) {
        console.log("\nUpdated student records:");
        console.table(rows);
      }
      process.exit();
    });
  });
};

// Check if attendancePercentage column exists; if not, add it before running sync
db.all("PRAGMA table_info(students)", [], (err, columns) => {
  if (err) {
    console.error("Error inspecting students table:", err.message);
    process.exit(1);
  }

  const colNames = columns.map((c) => c.name);
  if (!colNames.includes("attendancePercentage")) {
    console.log("Adding 'attendancePercentage' column to students table...");
    db.run("ALTER TABLE students ADD COLUMN attendancePercentage INTEGER DEFAULT 0", [], (alterErr) => {
      if (alterErr) {
        console.error("Failed to add column:", alterErr.message);
        process.exit(1);
      }
      runSync();
    });
  } else {
    runSync();
  }
});