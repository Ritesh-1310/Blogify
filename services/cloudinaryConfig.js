// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dlpsaohap',
    api_key: '262793268715446',
    api_secret: 'eWI6Gjmv2N12nO77sYX1UZdXnPM'
});

module.exports = cloudinary;
