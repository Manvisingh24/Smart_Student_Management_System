const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("Smart Student Management System Backend is Running!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});