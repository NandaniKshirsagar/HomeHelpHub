require("dotenv").config();
const db = require("../config/firebasedb"); // Correct Firebase import
const cloudinary = require('../config/img');
const multer = require('multer');
const upload = multer(); // No storage configuration for now (for simplicity)

const createUser = (req, res) => {
  console.log("Request body:", req.body);

  const { name, address, age, phone, email, profilePhotoUrl, latitude, longitude } = req.body;

  // if (!name || !address || !age || !phone || !email || latitude === undefined || longitude === undefined) {
  //   return res.status(400).json({
  //     message: "All fields are required (name, address, age, phone, email, latitude, longitude)",
  //   });
  // }
  

  // Function to sanitize the email (to handle special characters in the email)
  const sanitizeEmail = (email) => {
    return email.replace(/[\.\$#\[\]\/]/g, "_");
  };

  // Create the new user object including latitude and longitude
  const newUser = {
    name,
    address,
    age: Number(age) || 0,
    phone,
    email,
    profilePhoto: profilePhotoUrl || null,  // Use Cloudinary image URL
    latitude: Number(latitude),
    longitude: Number(longitude),
    createdAt: new Date().toISOString(),
  };

  // Remove undefined values from the user data
  const cleanUserData = Object.fromEntries(
    Object.entries(newUser).filter(([_, v]) => v !== undefined)
  );

  const userId = sanitizeEmail(email);
  const userRef = db.ref("client").child(userId);

  // Save user data to the database
  userRef.set(cleanUserData)
    .then(() => {
      console.log("User created successfully");
      return res.status(201).json({
        message: "User created successfully",
        userId: userId,
        profilePhoto: newUser.profilePhoto,
        coordinates: {
          latitude: newUser.latitude,
          longitude: newUser.longitude
        },
        profile: newUser
      });
    })
    .catch((error) => {
      console.error("Firebase error:", error);
      return res.status(500).json({
        message: "Failed to create user",
        error: error.message
      });
    });
};



const checkUserByEmail = (req, res) => {
    console.log('Request body:', req.body);
    const { email } = req.body;
    // Basic Validation for Email
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }
    // Fix Firebase invalid characters by replacing "." with "_"
    const userId = email.replace(/\./g, '_');  // Firebase doesn't allow '.' in keys
    // Reference to the user in Firebase using the formatted email
    const usersRef = db.ref('client');
    const userRef = usersRef.child(userId);
    // Check if the user exists by reading the user reference
    userRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            console.log(`User found for email: ${email}`);
            return res.status(200).json({
                message: 'found',
                email: email
            });
        } else {
            console.log(`No user found for email: ${email}`);
            return res.status(200).json({
                message: 'not',
                email: email
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


const uploadclientImage = async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }


      

      // Upload to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
          {
              folder: 'uploads',
              resource_type: 'auto',
          },
          (error, result) => {
              if (error) {
                  console.error('Cloudinary upload error:', error);
                  return res.status(500).json({ error: 'Upload failed' });
              }

              // Successful upload
              console.log('Asset ID: ' + result.asset_id);
              console.log('Image URL: ' + result.secure_url);

              // Respond with success and include image URL and asset ID
              return res.status(200).json({
                  success: true,
                  imageUrl: result.secure_url,
                  assetId: result.asset_id,
              });
          }
      );

      uploadStream.end(req.file.buffer);  // Send file buffer to Cloudinary
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Upload failed' });
  }
};


module.exports = {createUser,checkUserByEmail,uploadclientImage};
