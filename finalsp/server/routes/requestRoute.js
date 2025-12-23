require("dotenv").config();
const express = require("express");
const {updateStatus,getAcceptedBookings} = require("../controllers/requestController"); // Correct import
const router = express.Router();


router.post("/update-req",updateStatus); // New Route
router.post("/get-accepted-req",getAcceptedBookings); // New Route
//router.post('/get-client-data',getClientdata); // New Route

module.exports = router;
