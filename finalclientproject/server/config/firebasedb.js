require("dotenv").config();

const admin = require("firebase-admin");
const serviceAccount = require("./homehelphub-4ab19-firebase-adminsdk-fbsvc-e589d652a5.json"); // Update with the actual path

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homehelphub-4ab19-default-rtdb.firebaseio.com" // Replace with your Firebase Realtime Database URL
});

// Export the Firebase Realtime Database
const db = admin.database();
module.exports = db;
