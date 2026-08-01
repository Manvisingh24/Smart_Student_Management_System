const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate required fields
        if (!username || !password || !role) {
            return res.status(400).json({
                error: "Username, password and role are required"
            });
        }

        // Check if username already exists
        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            async (err, user) => {
                if (err) {
                    console.error("Error checking username:", err.message);

                    return res.status(500).json({
                        error: "Database error"
                    });
                }

                if (user) {
                    return res.status(400).json({
                        error: "Username already exists"
                    });
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user
                const sql = `
                    INSERT INTO users (username, password, role)
                    VALUES (?, ?, ?)
                `;

                db.run(
                    sql,
                    [username, hashedPassword, role],
                    function (err) {
                        if (err) {
                            console.error(
                                "Error creating user:",
                                err.message
                            );

                            return res.status(500).json({
                                error: "Failed to create user"
                            });
                        }

                        res.status(201).json({
                            message: "User registered successfully!",
                            userId: this.lastID
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        // Find user by username
        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            async (err, user) => {
                if (err) {
                    console.error("Error finding user:", err.message);

                    return res.status(500).json({
                        error: "Database error"
                    });
                }

                // User not found
                if (!user) {
                    return res.status(401).json({
                        error: "Invalid username or password"
                    });
                }

                // Compare entered password with stored hash
                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                // Password does not match
                if (!isMatch) {
                    return res.status(401).json({
                        error: "Invalid username or password"
                    });
                }

                // Generate JWT
                const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            // Login successful
            res.status(200).json({
                message: "Login successful!",
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
            }
        );
    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};