import express from 'express';
const router = express.Router();
import { postACategory, getAllCategory, getACategory, updateACategory, deleteACategory } from '../controllers/allControllers.js';

// Create Category
router.post("/category", postACategory);

// Get all categories
router.get("/category", getAllCategory);

// Get a category
router.get("/category/:id", getACategory);

// Update a category
router.put("/category/:id", updateACategory);

// Delete a category
router.delete("/category/:id", deleteACategory);

export default router;