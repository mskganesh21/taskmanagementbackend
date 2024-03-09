import express from "express";
import { CreatePriority,GetAllPriorities,GetPriority } from "../controller/PriorityController.js";
import {verifyAccessToken} from '../middleware/verifyAccessToken.js';

const router = express.Router();

router.post("/createpriority",  CreatePriority);
router.get('/getallpriorities',GetAllPriorities);
router.get('/getpriority/:priority', GetPriority);

export default router;


