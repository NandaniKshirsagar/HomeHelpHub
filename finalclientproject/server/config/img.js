
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: 'dbhzjx1xx', 
    api_key: '542125452981656', 
    api_secret: 'nc67AsImJuhl5TAUF5U-hZzDIBY' 
});

module.exports = cloudinary;