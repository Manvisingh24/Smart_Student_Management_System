const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Lock database path to the root/backend directory permanently
const dbPath = path.join(__dirname, "../students.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);

    db.serialize(() => {
      // 1. Create users table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
      `,
        (err) => {
          if (err) console.error("Error creating users table:", err.message);
          else console.log("Users table is ready!");
        }
      );

      // 2. Create students table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rollNo INTEGER UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT,
            attendancePercentage REAL DEFAULT 85,
            avgMarks REAL DEFAULT 78
        )
      `,
        (err) => {
          if (err) console.error("Error creating students table:", err.message);
          else {
            console.log("Students table is ready!");
            
            // Seed initial student data if empty
            db.get("SELECT COUNT(*) AS count FROM students", [], (err, row) => {
              if (!err && row && row.count === 0) {
                const seedQuery = `INSERT INTO students (rollNo, name, email, attendancePercentage, avgMarks) VALUES (?, ?, ?, ?, ?)`;
                db.run(seedQuery, [101, "Aarav Sharma", "aarav@example.com", 58, 38]); // High Risk
                db.run(seedQuery, [102, "Priya Patel", "priya@example.com", 72, 55]);  // Moderate Risk
                db.run(seedQuery, [103, "Rohan Verma", "rohan@example.com", 91, 84]);  // On Track
                console.log("Sample students seeded successfully!");
              }
            });
          }
        }
      );

      // 3. Create attendance table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rollNo INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (rollNo) REFERENCES students(rollNo)
        )
      `,
        (err) => {
          if (err) console.error("Error creating attendance table:", err.message);
          else console.log("Attendance table is ready!");
        }
      );

      // 4. Create subjects table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL
        )
      `,
        (err) => {
          if (err) console.error("Error creating subjects table:", err.message);
          else console.log("Subjects table is ready!");
        }
      );

      // 5. Create marks table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS marks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rollNo INTEGER NOT NULL,
            subjectId INTEGER NOT NULL,
            marksObtained REAL NOT NULL,
            maxMarks REAL DEFAULT 100,
            FOREIGN KEY (rollNo) REFERENCES students(rollNo),
            FOREIGN KEY (subjectId) REFERENCES subjects(id)
        )
      `,
        (err) => {
          if (err) console.error("Error creating marks table:", err.message);
          else console.log("Marks table is ready!");
        }
      );
    });
  }
});

module.exports = db;


db.serialize(() => {
  // Automatically add year column if missing
  db.run(`ALTER TABLE students ADD COLUMN year TEXT DEFAULT '4th Year'`, (err) => {
    if (err && !err.message.includes("duplicate column")) {
      console.error("Year column error:", err.message);
    }
  });

  // Automatically add email column if missing
  db.run(`ALTER TABLE students ADD COLUMN email TEXT`, (err) => {
    if (err && !err.message.includes("duplicate column")) {
      console.error("Email column error:", err.message);
    }
  });
});