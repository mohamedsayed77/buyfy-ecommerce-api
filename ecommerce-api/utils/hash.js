import crypto from "crypto";

const hashCode = (resetCode) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  return hashedCode;
};

export default hashCode;
