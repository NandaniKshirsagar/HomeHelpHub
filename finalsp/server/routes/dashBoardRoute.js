require("dotenv").config();
const express = require("express");
const {getUserData,getReq,getClientdata} = require("../controllers/dashBoardController"); // Correct import
const router = express.Router();


router.post("/get-user-data",getUserData); // New Route
router.post("/get-req",getReq); // New Route
router.post('/get-client-data',getClientdata); // New Route

module.exports = router;
