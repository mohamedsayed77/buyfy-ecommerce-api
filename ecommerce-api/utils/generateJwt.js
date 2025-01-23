import jwt from "jsonwebtoken";

/**
 * Creates a JSON Web Token (JWT) for authentication.
 * @param {Object} payload - The data to include in the token (e.g., user ID).
 * @returns {string} - A signed JWT token.
 */
const createToken = (payload) =>
  jwt.sign(
    { userId: payload }, // Include the user ID in the token payload
    process.env.JWT_SECRET_KEY, // Secret key for signing the token
    {
      expiresIn: process.env.JWT_EXPIRATION_TIME, // Token expiration time from environment variables
    }
  );

export default { createToken };
