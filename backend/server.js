require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");  
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
app.use(cors());

const PORT = 3000;

app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
    res.send("Smart Student Management System Backend is Running!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});