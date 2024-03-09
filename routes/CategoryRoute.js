import express from "express";
import { CreateCategory,GetAllCategories,GetCategory } from "../controller/CategoryController.js";
import {verifyAccessToken} from '../middleware/verifyAccessToken.js';

const router = express.Router();

router.post("/createcategory", CreateCategory);
router.get('/getallcategories', GetAllCategories);
router.get('/getcategory/:category', GetCategory);

export default router;


