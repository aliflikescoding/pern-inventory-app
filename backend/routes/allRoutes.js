import express from "express";
const router = express.Router();
import {
  postACategory,
  getAllCategory,
  getACategory,
  updateACategory,
  deleteACategory,
  createItem,
  getAllItem,
  getAnItem,
  updateAnItem,
  deleteItem,
  getItemsBasedOnCategory,
  getAllItemsWithCatName,
  updateACategoryItem
} from "../controllers/allControllers.js";

// Create Category
router.post("/categories", postACategory);

// Get all categories
router.get("/categories", getAllCategory);

// Get a category
router.get("/categories/:id", getACategory);

// Get items where based on the category
router.get("/categories/:id/item", getItemsBasedOnCategory);

// Update a category
router.put("/categories/:id", updateACategory);

// Delete a category
router.delete("/categories/:id", deleteACategory);

// Create item
router.post("/items", createItem);

// Get all items
router.get("/items", getAllItem);

// Get a items
router.get("/items/:id", getAnItem);

// Update a items
router.put("/items/:id", updateAnItem);

// Delete items
router.delete("/items/:id", deleteItem);

// Get items with name category
router.get("/allitems", getAllItemsWithCatName);

// Update category item
router.put("/categories/:id/item", updateACategoryItem);

export default router;
