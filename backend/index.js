const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("./db");
const authenticateToken = require("./middleware/authenticateToken");
const multer = require("multer");
const uploadBufferToCloudinary  = require("./utils/cloudinaryUpload");


dotenv.config()
const app = express()

// Middlewares
app.use(cors());
app.use(express.json());

// testing routes 
app.get("/", (req, res) => {
    res.send("Oravlis Backend is running");
})

app.post("/login", (req, res) => {
    const {email, password} = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({error: "Databse error"});
        if (!user) return res.status(400).json({error: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: "Invalid credentials"});

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET || "secretkey",
            {expiresIn: "1h"}
        )
        res.json({token, role: user.role});
        console.log("Login attempt:", email, password);
        console.log("User from DB:", user);
        console.log(token);
    })

})

app.get("/protected", authenticateToken, (req, res) => {
    res.json({message: "Protected route accessed", user: req.user});
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", authenticateToken, upload.single("image"), async (req, res) => {
    try{
        if(req.user.role !== "Technician") {
            return res.status(403).json({error: "Access denied"});
        }

        if(!req.file) {
            return res.status(400).json({error: "No file uploaded"});
        }
        // upload to cloudinary
        const result = await uploadBufferToCloudinary(req.file.buffer, "oralvis_uploads");

        // Insert into SQLite
        const {patientName, patientId, scanType, region} = req.body;
        const uploadDate = new Date().toISOString();

        await db.run(
            `INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [patientName, patientId, scanType, region, result.secure_url, uploadDate]
        );
        res.json({message: "Upload successful", imageUrl: result.secure_url});
    } catch (err) {
        console.error(err)
        res.status(500).json({error: "Upload failed"});
    }
})

app.get("/scans", authenticateToken, (req, res) => {
    if (req.user.role !== "Dentist") {
        return res.status(403).json({error: "Forbidden"});
    }

    db.all("SELECT * FROM scans ORDER BY uploadDate DESC", [], (err, rows) => {
        if (err) {
            console.log("DB error:", err);
            return res.status(500).json({error: "Database error"});
        }
        res.json(rows);
    });
})

const PORT = process.env.PORT || 5000;
// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});