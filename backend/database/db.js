const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../students.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to SQLite database successfully!");

        // Create users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error("Error creating users table:", err.message);
            } else {
                console.log("Users table is ready!");
            }
        });
    }
});

module.exports = db;

// Create attendance table
db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rollNo INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (rollNo) REFERENCES students(rollNo)
    )
`, (err) => {
    if (err) {
        console.error("Error creating attendance table:", err.message);
    } else {
        console.log("Attendance table is ready!");
    }
});