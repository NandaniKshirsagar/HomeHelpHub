const db = require('../config/firebasedb'); // Adjust the path as necessary

const updateStatus = async (req, res) => {
  const { bookingId, status } = req.body;

  // Ensure both bookingId and status are provided
  if (!bookingId || !status) {
    return res.status(400).json({ message: "Booking ID and status are required" });
  }

  try {
    // Reference to the specific booking using bookingId
    const bookingRef = db.ref(`bookings/${bookingId}`);

    // Fetch the current booking data
    const snapshot = await bookingRef.once('value');
    const booking = snapshot.val();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the status of the booking
    await bookingRef.update({ status });

    // Return a success response
    res.status(200).json({ message: "Booking status updated successfully", status: status });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};

const getAcceptedBookings = async (req, res) => {
  try {
    const { spEmail } = req.body;
    
    if (!spEmail) {
      return res.status(400).json({ message: "Service provider email is required" });
    }

    // Reference to the bookings node
    const bookingsRef = db.ref('bookings');
    
    // Query to find all bookings with matching spEmail
    const snapshot = await bookingsRef
      .orderByChild('spEmail')
      .equalTo(spEmail)
      .once('value');

    const allBookings = snapshot.val();
    const acceptedBookings = [];

    // Filter for accepted status and extract needed fields
    for (const key in allBookings) {
      const booking = allBookings[key];
      if (booking.status === 'accepted') {
        acceptedBookings.push({
          id: key,
          appointmentDate: booking.appointmentDate,
          appointmentTime: booking.appointmentTime,
          problemDescription: booking.problemDescription,
          clientEmail: booking.clientEmail,
          status: booking.status,
          // Add any other fields you need
        });
      }
    }

    res.status(200).json({ acceptedBookings });
  } catch (error) {
    console.error("Error fetching accepted bookings:", error);
    res.status(500).json({ message: "Error fetching accepted bookings", error: error.message });
  }
};

module.exports = {
  updateStatus,
  getAcceptedBookings
};