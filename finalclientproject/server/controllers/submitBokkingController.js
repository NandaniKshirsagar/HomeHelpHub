const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");  // Assuming Firebase Admin SDK is initialized

// Controller function to handle booking submission
const submitBooking = async (req, res) => {
  const {
    clientId,
    clientEmail,
    spId,
    spEmail,
    category,
    problemDescription,
    appointmentDate,
    appointmentTime,
  } = req.body;

  if (!clientId || !clientEmail || !spId || !spEmail || !category) {
    return res.status(400).json({ message: "Missing required booking fields." });
  }

  try {
    const bookingData = {
      clientId,
      clientEmail,
      spId,
      spEmail,
      category,
      problemDescription,
      appointmentDate,
      appointmentTime,
      status: "pending",
      createdAt: Date.now()
    };

    const bookingRef = admin.database().ref("bookings").push();
    await bookingRef.set(bookingData);

    return res.status(201).json({
      message: "Booking successfully created!",
      bookingData,
      bookingId: bookingRef.key,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Error creating booking.", error: error.message });
  }
};

//it searches bookings by email and returns the booking details
const getBookingsByEmail = async (req, res) => {
  const email = req.params.email;
  console.log("Searching for bookings with email:", email); // DEBUG

  try {
    const requestDetailsRef = admin.database().ref("RequestDetails");
    const snapshot = await requestDetailsRef.once("value");

    if (!snapshot.exists()) {
      console.log("No data under RequestDetails"); // DEBUG
      return res.status(404).json({ message: "No bookings found." });
    }

    const bookings = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      console.log("Checking:", data.clientEmail); // DEBUG

      if (data.clientEmail && data.clientEmail === email) {
        bookings.push({ referenceId: childSnapshot.key, ...data });
      }
    });

    if (bookings.length === 0) {
      console.log("No bookings matched the email"); // DEBUG
      return res.status(404).json({ message: "No bookings found for this email." });
    }

    console.log("Bookings found:", bookings); // DEBUG
    res.status(200).json({ bookings });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};





module.exports = { submitBooking,getBookingsByEmail };
