require("dotenv").config();
const express = require("express");
const {updateStatus,getBookings,getSpData} = require("../controllers/requestController"); // Correct import
const router = express.Router();


router.post("/update-req",updateStatus); // New Route
router.post("/get-req",getBookings); // New Route
router.post("/get-sp-data",getSpData); // New Route
//router.post('/get-client-data',getClientdata); // New Route

module.exports = router;
