const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./oralvis.db", (err) => {
    if (err) {
        console.error("Error opening Database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
})

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('Technician', 'Dentist'))
        )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT,
        patientId TEXT,
        scanType TEXT,
        region TEXT,
        imageUrl TEXT,
        uploadDate TEXT
    )`)
})

module.exports = db;