const db = require('../config/firebasedb');

const getProvidersByCategory = (req, res) => {
  console.log('Request body:', req.body);
  let { provider } = req.body;  // Destructure provider from request body
  
  // Basic Validation for provider
  if (!provider) {
      return res.status(400).json({
          message: "Provider is required"
      });
  }

  provider = provider.toLowerCase(); // Convert provider to lowercase
  
  // Reference to the 'service_provider' node in Firebase
  const usersRef = db.ref('service_provider');

  // Fetch the provider data based on the provider name
  const providerRef = usersRef.child(provider);

  providerRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
          // If provider exists, retrieve all profiles for that provider
          let providerData = snapshot.val();

          // Create an array to store all profiles
          const profiles = [];

          // Loop through each email node inside the provider category
          Object.keys(providerData).forEach((email) => {
              const profile = providerData[email]; // Get the profile data for each email
              profiles.push({
                  email: email.replace('_', '@'), // Restore the email format (if underscores were used)
                  ...profile // Merge profile data
              });
          });

          console.log('Provider Data:', profiles);

          return res.status(200).json({
              message: 'Provider found',
              providerData: profiles // Return all the profiles in the provider category
          });
      } else {
          console.log(`No provider found for ${provider}`);
          return res.status(404).json({
              message: 'Provider not found',
              provider: provider
          });
      }
  }, (error) => {
      console.error('Error fetching provider data:', error.message);
      return res.status(500).json({
          message: 'Error fetching provider data',
          error: error.message || 'Unknown error'
      });
  });
};



const getProviderDetails = (req, res) => {
  let { category, email } = req.body;  // Expect category and email to be passed in the request body

  // Basic validation for category and email
  if (!category || !email) {
      return res.status(400).json({
          message: "Category and email are required"
      });
  }

  // Sanitize the email to make it compatible with Firebase path (replace `@` and `.` with `_`)
 category = category.toLowerCase(); // Convert category to lowercase
  const sanitizedEmail = req.body.email.replace(/\./g, '_');  // Fix invalid characters in email for Firebase paths


  // Reference to the 'service_provider' node in Firebase
  const usersRef = db.ref('service_provider');

  // Log the reference path for debugging
  console.log(`Trying to fetch provider with path: ${category}/${sanitizedEmail}`);

  // Reference to the specific category and provider email
  const providerRef = usersRef.child(category).child(sanitizedEmail);

  providerRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
          // If provider exists, return the provider data
          return res.status(200).json({
              message: 'Provider found',
              providerData: snapshot.val() // Return the specific provider data
          });
      } else {
          console.log(`No provider found for category: ${category}, email: ${sanitizedEmail}`);
          return res.status(404).json({
              message: 'Provider not found',
              email: sanitizedEmail,
              category: category
          });
      }
  }, (error) => {
      console.error('Error fetching provider data:', error.message);
      return res.status(500).json({
          message: 'Error fetching provider data',
          error: error.message || 'Unknown error'
      });
  });
};


module.exports = { getProvidersByCategory,getProviderDetails };
