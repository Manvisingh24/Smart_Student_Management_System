const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../students.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to SQLite database successfully!");

        // 1. Create users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `, (err) => {
            if (err) console.error("Error creating users table:", err.message);
            else console.log("Users table is ready!");
        });

        // 2. Create attendance table
        db.run(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rollNo INTEGER NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL,
                FOREIGN KEY (rollNo) REFERENCES students(rollNo)
            )
        `, (err) => {
            if (err) console.error("Error creating attendance table:", err.message);
            else console.log("Attendance table is ready!");
        });

        // 3. Create subjects table
        db.run(`
            CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL
            )
        `, (err) => {
            if (err) console.error("Error creating subjects table:", err.message);
            else console.log("Subjects table is ready!");
        });

        // 4. Create marks table
        db.run(`
            CREATE TABLE IF NOT EXISTS marks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rollNo INTEGER NOT NULL,
                subjectId INTEGER NOT NULL,
                marksObtained REAL NOT NULL,
                maxMarks REAL DEFAULT 100,
                FOREIGN KEY (rollNo) REFERENCES students(rollNo),
                FOREIGN KEY (subjectId) REFERENCES subjects(id)
            )
        `, (err) => {
            if (err) console.error("Error creating marks table:", err.message);
            else console.log("Marks table is ready!");
        });
    }
});

module.exports = db;