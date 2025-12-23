const express = require('express');
const router = express.Router();
const { submitBooking ,getBookingsByEmail} = require('../controllers/submitBokkingController');

// Define the route to handle POST requests for /submit-booking (no file upload)
router.post('/submit-booking', submitBooking);
router.get("/email/:email", getBookingsByEmail);


module.exports = router;
