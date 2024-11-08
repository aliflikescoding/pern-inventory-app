import express from 'express';
import path from "path";
import logger from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import allRoutes from "./routes/allRoutes.js";

const port = process.env.PORT || 5000;
const app = express();

// Enable CORS for all routes
app.use(cors());

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger('dev'));

// Setup static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use(allRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));