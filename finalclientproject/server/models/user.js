const db = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    },

    create: async (email, password, callback) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], callback);
        } catch (error) {
            console.error("Error hashing password:", error);
            callback(error, null);
        }
    }
};

module.exports = User;
