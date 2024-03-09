import { verifyJWT } from "../utils/verifyToken.js";

export const verifyCookieToken = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies) {
    return res.status(401).json({
      error: true,
      success: false,
      data: "Unauthorised",
    });
  }
  console.log(cookies, "zzzz");
  const token = cookies.jwt;
  console.log(token, "nnn");
  const response = verifyJWT(token, process.env.REFRESH_TOKEN_SECRET);

  if (!response) {
    return res.status(401).json({
      error: true,
      success: false,
      data: "Unauthorised",
    });
  }

  req.authdata = response;
  req.authtoken = token;
  next();
};
