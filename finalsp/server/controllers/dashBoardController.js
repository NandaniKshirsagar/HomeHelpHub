const db = require("../config/firebasedb");

const getUserData = async (req, res) => {
    console.log('Request body:', req.body);

    let { email, category } = req.body;

    if (!email || !category) {
        return res.status(400).json({
            message: "Email and category are required"
        });
    }

    // Sanitize email to replace '.' with '_'
    const userId = email.replace(/\./g, '_');
    const sanitizedCategory = category.replace(/\s+/g, ' ').trim();

    console.log('Sanitized data:', { userId, sanitizedCategory });

    try {
        const userRef = db.ref(`service_provider/${sanitizedCategory}/${userId}`);
        console.log('Firebase path:', `service_provider/${sanitizedCategory}/${userId}`);

        const userSnapshot = await userRef.once('value');
        const user = userSnapshot.val();

        console.log('Firebase path:', `service_provider/${sanitizedCategory}/${userId}`);
console.log('Snapshot exists:', userSnapshot.exists());  // Check if data exists at the path
console.log('Snapshot value:', userSnapshot.val());  // Log the returned value

if (userSnapshot.exists()) {
    const user = userSnapshot.val();
    console.log('User data:', user);
    return res.status(200).json({
        message: 'User found',
        email: email,
        category: sanitizedCategory,
        profileData: user,
    });
} else {
    return res.status(404).json({
        message: 'User not found',
    });
}

    } catch (error) {
        console.error('Error checking user:', error);
        return res.status(500).json({
            message: 'Error checking user',
            error: error.message || 'Unknown error'
        });
    }
};

// Express Route to get incoming requests for a service provider
const getReq = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Service provider email is required" });
    }
  
    try {
      // Get bookings for the service provider from Firebase
      const bookingsRef = db.ref('bookings');
      const snapshot = await bookingsRef.orderByChild('spEmail').equalTo(email).once('value');
  
      const bookings = snapshot.val();
      if (bookings) {
        const incomingRequests = Object.keys(bookings).map(key => ({
          ...bookings[key],
          id: key, // Include the booking ID
        }));
        res.status(200).json({ incomingRequests });
      } else {
        // Return empty array instead of 404 for new accounts
        res.status(200).json({ incomingRequests: [] });
      }
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
      res.status(500).json({ message: "Error fetching incoming requests", error: error.message });
    }
  };
  
  const getClientdata = (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email);

    // Basic Validation for Email
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    // Fix Firebase invalid characters by replacing "." with "_"
    const userId = email.replace(/\./g, '_');
    const usersRef = db.ref('client');
    const userRef = usersRef.child(userId);

    // Check if the user exists
    userRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            return res.status(200).json({
                message: 'found',
                email: email,
                profileData: snapshot.val(),
            });
        } else {
            console.log("user not found")
            return res.status(404).json({
                
                message: 'User not found for this email',
                email: email,
            });
        }
    }, (error) => {
        console.error('Error checking user:', error.message);
        return res.status(500).json({
            message: 'Error checking user',
            error: error.message || 'Unknown error'
        });
    });
};



module.exports = { getUserData,getReq,getClientdata };
