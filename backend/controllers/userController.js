const db = require("../database/db");

const updateUsername = (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            success: false,
            message: "Username is required"
        });
    }

    db.get(
        "SELECT * FROM users WHERE username = ? AND id != ?",
        [username, id],
        (err, user) => {
            if (err) {
                console.error("Error checking username:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (user) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            }

            db.run(
                "UPDATE users SET username = ? WHERE id = ?",
                [username, id],
                function (err) {
                    if (err) {
                        console.error("Error updating username:", err.message);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to update username"
                        });
                    }

                    if (this.changes === 0) {
                        return res.status(404).json({
                            success: false,
                            message: "User not found"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Username updated successfully!"
                    });
                }
            );
        }
    );
};

module.exports = {
    updateUsername
};