const { db } = require("../config/firebase");

class User {
  static async getUserByEmail(email) {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  static async createUser(email, otp) {
    await db.collection("users").doc(email).set({
      email,
      otp,
      createdAt: new Date(),
    });
  }

  static async storeOTP(email, otp) {
    await db.collection("otps").doc(email).set({
      otp,
      expiresAt: Date.now() + 300000, // 5 min expiry
    });
  }

  static async verifyOTP(email, otp) {
    const otpDoc = await db.collection("otps").doc(email).get();
    if (!otpDoc.exists || otpDoc.data().otp !== otp) return false;

    return true;
  }
}

module.exports = User;
