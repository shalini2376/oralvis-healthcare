const bcrypt = require("bcryptjs");
const db = require("./db");

const seedUsers = async () => {
    try{
        const hashedTechPass = await bcrypt.hash("tech123", 10);
        const hashedDentistPass = await bcrypt.hash("dentist123", 10);
        db.run(
            `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
            ["tech@example.com", hashedTechPass, "Technician"]
        );

        db.run(
            `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
            ["dentist@example.com", hashedDentistPass, "Dentist"]
        );
        console.log("Users seeded successfully");

    } catch (err) {
        console.error("Error seeding users:", err);
    }
};

seedUsers();

