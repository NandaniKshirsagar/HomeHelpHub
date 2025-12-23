// Example (Express.js server)
const express = require('express');
const router = express.Router();
const { getProvidersByCategory,getProviderDetails} = require('../controllers/providerController');

// Check the URL pattern: /api/provider/getProvider
router.post('/getProvider', getProvidersByCategory);
router.post('/getProviderDetails', getProviderDetails);

module.exports = router;
