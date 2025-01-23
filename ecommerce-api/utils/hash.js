import crypto from "crypto";

/**
 * Hashes a given reset code using SHA-256.
 * @param {string} resetCode - The reset code to be hashed.
 * @returns {string} - The hashed code in hexadecimal format.
 */
const hashCode = (resetCode) => {
  // Use SHA-256 to hash the reset code and convert it to a hexadecimal string
  const hashedCode = crypto
    .createHash("sha256") // Specify the hashing algorithm
    .update(resetCode) // Update with the input reset code
    .digest("hex"); // Convert the hash to a hex string

  return hashedCode;
};

export default hashCode;
