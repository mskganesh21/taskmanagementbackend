import express from "express";
import {
  CreateTask,
  EditTask,
  DeleteTask,
  GetAllTasks,
  GetTasks,
  GetDeadlinePassedTasks,
  GetDeadlinePassedTasksOfAUser
} from "../controller/TaskController.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

const router = express.Router();

router.post("/createtask", verifyAccessToken, CreateTask);
router.put("/edittask/:taskId",verifyAccessToken, EditTask);
router.delete("/deletetask/:taskId", verifyAccessToken, DeleteTask);
router.get("/getalltasks", GetAllTasks);
router.get("/gettasks",verifyAccessToken, GetTasks);
router.get('/getexpiredtasks', GetDeadlinePassedTasks);
router.get('/getexpiredtasksofauser', GetDeadlinePassedTasksOfAUser);

export default router;
