require("dotenv").config();
const db = require("../config/firebasedb"); // Correct Firebase import
const multer = require('multer');

const cloudinary = require('../config/img');

// Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 1 * 1024 * 1024 // Limit to 1MB (1 * 1024 * 1024 bytes)
  }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});


// Create a new service provider
const createServiceProvider = async (req, res) => {
    console.log("Request body:", req.body);

    const { 
        name, email, phone, category, experience, available_hours, 
        locations, id_proof, profile_photo, bio, languages, aadhar_photo
    } = req.body;

    // Define allowed categories
    const validCategories = ["electrician", "plumber", "carpenter", "painter", "gardener","maid","home_tutor"];

    // Ensure category is provided and valid
    if (!category || !validCategories.includes(category)) {
        return res.status(400).json({
            message: "Invalid or missing service category",
            validCategories
        });
    }

    // Validate required fields
    const requiredFields = [
        'name', 'email', 'phone', 'category', 'experience', 
        'available_hours', 'locations', 'id_proof', 'bio', 'languages',
        'profile_photo', 'aadhar_photo'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Missing required fields",
            missingFields
        });
    }

    // Validate locations (minimum 3)
    if (!Array.isArray(locations) || locations.length < 3) {
        return res.status(400).json({
            message: "Please select at least 3 service locations"
        });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number (Indian format)
    if (!/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number format (10 digits starting with 6-9)" });
    }

    // Validate Aadhar number (12 digits)
    if (!/^\d{12}$/.test(id_proof)) {
        return res.status(400).json({ message: "Invalid Aadhar number (must be 12 digits)" });
    }

    // Construct service provider object
    const newServiceProvider = {
        name,
        email,
        phone,
        category,
        experience: parseInt(experience),
        available_hours: parseInt(available_hours),
        locations,
        id_proof,
        profile_photo,
        aadhar_photo,
        bio,
        languages: Array.isArray(languages) ? languages : [languages],
        service_areas: locations.join(", "),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        rating: 0,
        total_jobs: 0
    };

    try {
        // Replace "." with "_" in email to avoid Firebase key issues
        const userId = email.replace(/\./g, "_");

        // Store under category node
        const userRef = db.ref(`service_provider/${category}`).child(userId);

        // Check if provider already exists in the category
        const snapshot = await userRef.once('value');
        if (snapshot.exists()) {
            return res.status(400).json({
                message: `Service provider with this email already exists in ${category}`,
                code: "PROVIDER_EXISTS"
            });
        }

        // Save provider data
        await userRef.set(newServiceProvider);
        
        console.log(`Service provider created successfully under ${category}`);
        return res.status(201).json({
            success: true,
            message: `Service provider created successfully under ${category}`,
            userId: email,
            providerId: userId,
            category: category,
            data: {
                ...newServiceProvider,
                id_proof: undefined // Remove sensitive data from response
            }
        });

    } catch (error) {
        console.error("Error creating service provider:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating service provider",
            error: error.message || "Unknown error",
            code: "SERVER_ERROR"
        });
    }
};

const checkUserByEmail = async (req, res) => {
    console.log('Request body:', req.body);
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    // Fix Firebase invalid characters by replacing "." with "_"
    const userId = email.replace(/\./g, '_');

    try {
        // Reference to all service provider categories
        const categoriesRef = db.ref('service_provider');
        const categoriesSnapshot = await categoriesRef.once('value');

        if (!categoriesSnapshot.exists()) {
            return res.status(200).json({
                message: 'not',
                email
            });
        }

        let userFound = false;
        let userCategory = "";

        // Loop through all subcategories (carpenter, plumber, etc.)
        for (const category of Object.keys(categoriesSnapshot.val())) {
            const userRef = db.ref(`service_provider/${category}/${userId}`);
            const userSnapshot = await userRef.once('value');

            if (userSnapshot.exists()) {
                userFound = true;
                userCategory = category;
                break;
            }
        }

        if (userFound) {
            console.log(`User found under category: ${userCategory}`);
            return res.status(200).json({
                message: 'found',
                email: email,
                category: userCategory
            });
        } else {
            console.log(`No user found for email: ${email}`);
            return res.status(200).json({
                message: 'not',
                email: email
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






const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileExtension = req.file.originalname.split('.').pop();
        const newFileName = `${req.body.email}_profile`;

        // Upload to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'uploads',
                public_id: newFileName,
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



module.exports = {createServiceProvider,checkUserByEmail,uploadProfileImage };
