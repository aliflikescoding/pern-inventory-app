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
  getAllItemsWithCatName
} from "../controllers/allControllers.js";

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

// Create item
router.post("/item", createItem);

// Get all items
router.get("/item", getAllItem);

// Get a items
router.get("/item/:id", getAnItem);

// Update a items
router.put("/item/:id", updateAnItem);

// Delete items
router.delete("/item/:id", deleteItem);

// Get items where based on the category
router.get("/categoryitem/:id", getItemsBasedOnCategory);

// Get items with name
router.get("/itemwithcatname", getAllItemsWithCatName);

export default router;
