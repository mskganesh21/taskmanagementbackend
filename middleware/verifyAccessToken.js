import {verifyJWT} from '../utils/verifyToken.js';

export const verifyAccessToken = (req,res,next) => {
    const authHeader = req.headers["authorization"];
    console.log(authHeader, "xxxx");
    if(!authHeader){
        return res.status(401).json({
            error: true,
            success: false,
            data: "Unauthorised",
          });
    }
    const token = authHeader.split(" ")[1];
    const response = verifyJWT(token,process.env.ACCESS_TOKEN_SECRET);

    if(!response){
        return res.status(401).json({
            error: true,
            success: false,
            data: "Unauthorised",
          });
    }

    console.log(response.jwt, "zxcvbn");

    req.authdata = response.jwt;

    next();
}