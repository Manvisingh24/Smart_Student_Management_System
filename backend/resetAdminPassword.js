const bcrypt = require("bcrypt");
const db = require("./database/db");

const newPassword = "Admin@123";

bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
        console.error("Error hashing password:", err.message);
        return;
    }

    const sql = `
        UPDATE users
        SET password = ?
        WHERE username = ?
    `;

    db.run(sql, [hashedPassword, "manvi_admin"], function (err) {
        if (err) {
            console.error("Error resetting password:", err.message);
            return;
        }

        if (this.changes === 0) {
            console.log("Admin user not found.");
        } else {
            console.log("Admin password reset successfully!");
        }

        db.close();
    });
});