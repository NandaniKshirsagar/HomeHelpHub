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

const getBookings = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Client email is required" });
    }

    // Reference to the bookings node in your database
    const bookingsRef = db.ref('bookings');
    
    // Query to find all bookings with matching client email
    const snapshot = await bookingsRef
      .orderByChild('clientEmail')
      .equalTo(email)
      .once('value');

    const allBookings = snapshot.val();

    if (!allBookings) {
      return res.status(200).json({ message: "No bookings found for this client." });
    }

    // Create an array to store all bookings, regardless of status
    const allBookingsArray = [];

    // Loop through all bookings and push each to the array
    for (const key in allBookings) {
      const booking = allBookings[key];
      allBookingsArray.push({
        id: key,
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        problemDescription: booking.problemDescription,
        clientEmail: booking.clientEmail,
        status: booking.status,
        spId: booking.spId,
        spCategory: booking.category,
      });
    }

    // Send the response with all bookings
    res.status(200).json({ allBookings: allBookingsArray });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};


const getSpData = async (req, res) => {
  console.log('Request body:', req.body);

  let { SpId, Spcategory } = req.body;

  if (!SpId || !Spcategory) {
      return res.status(400).json({
          message: "Id and category are required"
      });
  }

  // Sanitize category to replace spaces and trim it
  const sanitizedCategory = Spcategory.replace(/\s+/g, ' ').trim();
  
  console.log('Sanitized data:', { SpId, sanitizedCategory });

  try {
      // Removed Firebase path log
      const userRef = db.ref(`service_provider/${sanitizedCategory}/${SpId}`);
      const userSnapshot = await userRef.once('value');
      const user = userSnapshot.val();

      console.log('Fetched data from DB:', user);

      if (userSnapshot.exists()) {
          // Log response data before sending it
          console.log('User found:', { email: user.email, name: user.name });

          return res.status(200).json({
              message: 'User found',
              email: user.email,
              name: user.name,
          });
      } else {
          console.log('User not found for SpId:', SpId);
          return res.status(404).json({
              message: 'User not found',
          });
      }
  } catch (error) {
      console.error('Error occurred during user check:', error);
      return res.status(500).json({
          message: 'Error checking user',
          error: error.message || 'Unknown error'
      });
  }
};


module.exports = {
  updateStatus,
  getBookings,
  getSpData
};