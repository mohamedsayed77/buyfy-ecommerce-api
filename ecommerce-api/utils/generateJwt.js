import jwt from "jsonwebtoken";

const createToken = (pyload) =>
  jwt.sign({ userId: pyload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

export default { createToken };
