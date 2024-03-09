import bcryptjs from "bcryptjs";
import path from "node:path";
import crypto from "node:crypto";
import ejs from "ejs";
import { fileURLToPath } from "node:url";
import User from "../models/UserModel.js";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  matchPasswords,
} from "../utils/validations.js";
import { sendEmail } from "../utils/sendEmail.js";
import { CreateToken } from "../utils/createToken.js";
import { CreateHash } from "../utils/createHash.js";
import { verifyJWT } from "../utils/verifyToken.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

console.log(__dirname, "lll");

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDir = path.dirname(currentFilePath);

console.log(currentDir, "kkk");

const RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate request body
  const isValidEmail = validateEmail(email);
  const isValidPassword = validatePassword(password);
  const isValidUsername = validateUsername(username);

  // If email is invalid, return
  if (!isValidEmail) {
    return res.status(422).json({
      error: true,
      success: false,
      data: "Invalid email format",
    });
  }

  // If password is invalid, return
  if (!isValidPassword) {
    return res.status(422).json({
      error: true,
      success: false,
      data: "Invalid password format",
    });
  }

  // If username is invalid, return
  if (!isValidUsername) {
    return res.status(422).json({
      error: true,
      success: false,
      data: "Invalid username format",
    });
  }

  try {
    // Find if a user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: true,
        success: false,
        data: "User already registered. Please try with a different email",
      });
    }

    //creating a hashed password
    const hashedPassword = await CreateHash(password);

    console.log(hashedPassword, "kk");

    //create a verify email token
    const verifyEmailToken = CreateToken(
      process.env.ACCESS_TOKEN_SECRET,
      "email",
      email,
      "5d"
    );

    // creating a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verifyEmailToken: verifyEmailToken,
    });

    //send a verification email
    const file = path.join(
      __dirname,
      "..",
      "views",
      "verificationEmailRequest.ejs"
    );

    const fileContent = await ejs.renderFile(file, {
      email: email,
      token: verifyEmailToken,
    });

    //sending email
    const sendEmailResponse = await sendEmail(
      email,
      "Verify Email",
      fileContent
    );

    console.log(sendEmailResponse);

    console.log(newUser, "abc");

    return res.status(201).json({
      error: false,
      success: true,
      data: "User created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      success: false,
      data: "Something went wrong. Please try again",
    });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  const isvalidEmail = validateEmail(email);
  const isValidPassword = validatePassword(password);

  //if email is invalid then return
  if (!isvalidEmail) {
    return res.status(422).json({
      error: true,
      success: false,
      data: "Invalid email format",
    });
  }

  //if password is invalid then return
  if (!isValidPassword) {
    return res.status(422).json({
      error: true,
      success: false,
      data: "Invalid Password format",
    });
  }

  try {
    // find the user with the email
    const user = await User.findOne({ email });

    //if user is not found
    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        data: "User is not registered",
      });
    }
    //compare password with user in db
    const validatePassword = await bcryptjs.compare(password, user.password);

    //if password is not valid
    if (!validatePassword) {
      return res.status(401).json({
        error: true,
        success: false,
        data: "wrong password Entered",
      });
    }

    //creating an accessToken
    const accessToken = CreateToken(
      process.env.ACCESS_TOKEN_SECRET,
      "jwt",
      user._id.toString(),
      "2h"
    );

    console.log(accessToken, "gg");

    //create a refresh token as a cookie
    const refreshToken = CreateToken(
      process.env.REFRESH_TOKEN_SECRET,
      "jwt",
      user._id.toString(),
      "1d"
    );

    console.log(refreshToken, "ff");

    //save the refeshtoken in db
    user.refreshTokenCookie = refreshToken;

    await user.save();

    //send the refresh token as a secure cookie

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      error: false,
      success: true,
      data: "Login Successful",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      success: false,
      data: "Something wen't wrong. Please try again",
    });
  }
};

const ResetPassword = async (req, res) => {
  const { newPassword, confirmPassword, token, email } = req.body;

  //verify token

  const jwtresponse = verifyJWT(token, process.env.ACCESS_TOKEN_SECRET);

  if (!jwtresponse) {
    return res.status(403).json({
      error: true,
      success: false,
      data: "Invalid or expired Token",
    });
  }

  //validate jwtresponsedata with the email from body
  const emailMatch = email === jwtresponse.email;
  console.log(emailMatch);

  //if email matches then proceed
  if (emailMatch) {
    //validate newPassword and confirmPassword

    const isValidNewPassword = validatePassword(newPassword);
    const isValidConfirmPassword = validatePassword(confirmPassword);

    //if password is invalid then return
    if (!isValidNewPassword) {
      return res.status(422).json({
        error: true,
        success: false,
        data: "Invalid Password format",
      });
    }

    //if password is invalid then return
    if (!isValidConfirmPassword) {
      return res.status(422).json({
        error: true,
        success: false,
        data: "Invalid Password format",
      });
    }

    //test if both password and confirm password are the same
    const isPasswordsMatch = matchPasswords(newPassword, confirmPassword);

    if (!isPasswordsMatch) {
      return res.status(400).json({
        error: true,
        success: false,
        data: "New Password and confirm password do not match",
      });
    }

    try {
      // find the user with email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          error: true,
          success: false,
          data: "No user found with the email",
        });
      }

      // //compare token with token in database
      // const comparewithtoken = token === user.forgotPasswordToken;

      // Compare tokens using a secure comparison method
      const comparewithtoken = crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.forgotPasswordToken)
      );

      if (comparewithtoken) {
        // generate a password hash
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // update the user with the new password
        user.password = hashedPassword;

        //update the token in the database
        user.forgotPasswordToken = "";
        await user.save();

        return res.status(200).json({
          error: false,
          success: true,
          data: "Password reset successful",
        });
      } else {
        return res.status(403).json({
          error: true,
          success: false,
          data: "Invalid or expired Token",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        success: false,
        data: "Something went wrong. Please try again",
      });
    }
  } else {
    return res.status(403).json({
      error: true,
      success: false,
      data: "Unauthorized User",
    });
  }
};

const VerifyUser = async (req, res) => {
  const file = path.join(
    __dirname,
    "..",
    "views",
    "verificationEmailResponse.ejs"
  );

  const { email, token } = req.query;
  //verify the token
  const response = verifyJWT(token, process.env.ACCESS_TOKEN_SECRET);

  if (response) {
    // compare with email
    const EmailMatch = email === response.email;

    if (EmailMatch) {
      // update verified in users db
      const user = await User.findOne({ email });

      //compare with verify token in db
      const tokenMatch = user.verifyEmailToken === token;

      if (tokenMatch) {
        //update isVerified
        user.isVerified = true;
        user.verifyEmailToken = "";
        await user.save();

        const fileContent = await ejs.renderFile(file, {
          title: "Verification Successful",
          description:
            "Verification Successful. Please close this Tab and login",
        });

        return res.status(200).send(fileContent);
      }
    }
  }
  const fileContent = await ejs.renderFile(file, {
    title: "Verification Failure",
    description: "Invalid or expired Token. Please try again for verification",
  });

  return res.status(200).send(fileContent);
};

const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  //validate email
  const isValidEmail = validateEmail(email);

  //if email is invalid then return
  if (!isValidEmail) {
    return res.status(422).json({
      error: true,
      success: false,
      data: "Invalid email format",
    });
  }

  //find the user with email
  try {
    // find the user with the email
    const user = await User.findOne({ email });

    //if user is not found
    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        data: "User is not registered",
      });
    }

    //create a ForgotPasswordToken
    const forgotToken = CreateToken(
      process.env.ACCESS_TOKEN_SECRET,
      "email",
      email,
      "1d"
    );

    //save the forgotpassword token in the database
    user.forgotPasswordToken = forgotToken;
    await user.save();

    console.log(forgotToken, "ff");

    const emailTemplatePath = path.join(
      __dirname,
      "..",
      "views",
      "ResetPasswordView.ejs"
    );

    const emailContent = await ejs.renderFile(emailTemplatePath, {
      email: email,
      token: forgotToken,
    });

    const response = await sendEmail(
      email,
      "Password Reset Link",
      emailContent
    );
    console.log(response, "email");

    //we need to properly handle the response
    //we have to see documentation for the response codes

    return res.status(200).json({
      error: false,
      success: true,
      data: "Email sent to reset Password",
    });
  } catch (error) {
    console.log(error);
  }
};


const GetToken = async (req, res) => {
  const token = CreateToken(
    process.env.ACCESS_TOKEN_SECRET,
    "email",
    "mskganesh18@gmail.com",
    "1m"
  );

  return res.status(200).json({
    error: false,
    success: true,
    data: token,
  });
};

const VerifyTokens = (req, res) => {
  const { token } = req.body;
  const response = verifyJWT(token, process.env.ACCESS_TOKEN_SECRET);
  if (!response) {
    console.log("hello");
    return res.status(403).json({
      error: true,
      success: false,
      data: "Token Invalid or Expired",
    });
  } else {
    console.log(response, "pppppp");
    return res.status(200).json({
      error: false,
      success: true,
      data: response,
    });
  }
};

const SendHTML = async (req, res) => {
  const responseFile = path.join(
    __dirname,
    "..",
    "views",
    "verificationEmail.ejs"
  );

  const emailContent = await ejs.renderFile(responseFile, {
    title: title,
    description: description,
  });

  res.status(200).render(responseFile);
};

const RefreshLogin = async (req,res) => {
    //we get refesh token from req.authdata
    const token = req.authtoken;
    const userId = req.authdata.jwt;
    console.log(userId, "bbbbb");
    //get details from db
    const user = await User.findById(userId);
    console.log(user, "gggggggg");

    const tokensMatch = token === user.refreshTokenCookie;
    console.log(tokensMatch, "llll");
    if(tokensMatch){

    //create an accesstoken
    const newAccessToken = CreateToken(process.env.ACCESS_TOKEN_SECRET,"email", user._id.toString(), '10m');

      return res.status(200).json({
        error:false,
        success:true,
        data: newAccessToken
      })
    }
}

export {
  RegisterUser,
  LoginUser,
  ResetPassword,
  VerifyUser,
  ForgotPassword,
  GetToken,
  VerifyTokens,
  SendHTML,
  RefreshLogin
};
