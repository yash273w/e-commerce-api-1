const jwt = require("jsonwebtoken");

const SECRET_KEY = "jnasiuywhebruytyfghfytrujasjlkdiua0z9ujknwejhyiueywqjhweui";

// Generate JWT Token
const generateToken = (userId) => {
  const token= jwt.sign({ userId }, SECRET_KEY, { expiresIn: "48h" })
  return token;
}


// Decode and Verify Token
const getUserIdFromToken = (token) => {
  
    const decodedToken = jwt.verify(token, SECRET_KEY)
    return decodedToken.userId;
}
    // Throw the error to be handled in middleware
  


module.exports = { generateToken, getUserIdFromToken };
