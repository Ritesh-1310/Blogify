require("dotenv").config();
const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
    name: user.fullName, 
  };
  const token = JWT.sign(payload, secret, { expiresIn: '1h' }); // Optionally set an expiration
  return token;
}


function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    throw new Error("Token validation failed");
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
