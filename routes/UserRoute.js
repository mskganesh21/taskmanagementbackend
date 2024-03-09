import express from "express";
import {
  RegisterUser,
  LoginUser,
  ResetPassword,
  VerifyUser,
  ForgotPassword,
  GetToken,
  VerifyTokens,
  SendHTML,
  RefreshLogin
} from "../controller/UserController.js";
import { verifyCookieToken } from "../middleware/verifyCookieToken.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.patch("/resetpassword", ResetPassword);
router.post("/forgotpassword", ForgotPassword);
router.get("/gettoken", GetToken);
router.post("/verifytoken", VerifyTokens);
router.get("/sendhtml", SendHTML);
router.get('/verifyUser', VerifyUser);
router.get('/refresh', verifyCookieToken, RefreshLogin);

export default router;
