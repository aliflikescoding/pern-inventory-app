import express from 'express';
import path from "path";
import logger from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import allRoutes from "./routes/allRoutes.js";
import rateLimit from 'express-rate-limit';

const port = process.env.PORT || 5000;
const app = express();

// Enable CORS for all routes
app.use(cors({ origin: 'https://pern-inventory-kws9ns0rg-aliflikescodings-projects.vercel.app/' }));

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

// rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests, please try again after 15 minutes.",
});
app.use(limiter);

// routes
app.use(allRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));