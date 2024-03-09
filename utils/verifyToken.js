import jwt from "jsonwebtoken";

export const verifyJWT = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.log(err);
  }
};
