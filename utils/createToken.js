import jwt from "jsonwebtoken";

export const CreateToken = (secret, key, value, expiry) => {
  const payload = { [key]: value };
  const token = jwt.sign(payload, secret, { expiresIn: expiry });
  return token;
};
