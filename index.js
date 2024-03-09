import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB } from "./config/dbConnect.js";
import UserRoutes from "./routes/UserRoute.js";
import TaskRoutes from './routes/TaskRoute.js';
import CategoryRoutes from './routes/CategoryRoute.js';
import PriorityRoutes from './routes/PriorityRoute.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

console.log(__dirname, "vvvvv");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({ limit: "500mb" })); // Use body-parser directly for JSON parsing
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" })); // Use body-parser directly for URL-encoded data

app.use(morgan("tiny"));

app.disable("x-powered-by");

app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

app.use("/api/user", UserRoutes);
app.use("/api/task",TaskRoutes);
app.use('/api/category',CategoryRoutes);
app.use('/api/priority',PriorityRoutes);

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
