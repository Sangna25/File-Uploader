const cloudinary = require("cloudinary").v2;
//Upload → Cloudinary returns public_id + secure_url → save them in Prisma.
cloudinary.config({
  secure: true,
});

module.exports = cloudinary;