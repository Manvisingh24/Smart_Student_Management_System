const db = require("./database/db");

console.log("\n=== CHECKING USERS TABLE ===");
db.all("SELECT id, username, role FROM users", [], (err, rows) => {
  console.log("Users:", rows);

  console.log("\n=== CHECKING STUDENTS TABLE ===");
  db.all("SELECT * FROM students", [], (err, rows) => {
    console.log("Students:", rows);
  });
});