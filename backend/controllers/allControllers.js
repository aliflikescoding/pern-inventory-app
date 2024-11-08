import { insertIntoCategory, getAllCategories, getIdCategory, updateIdACategory, deleteIdCategory } from "../db/queries.js";

// desc Post a category
// @route POST /category
export const postACategory = async (req, res, next) => {
  try {
    const { category_name, category_image_link } = req.body;
    const newCategory = await insertIntoCategory(category_name, category_image_link);
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err);
  }
}

// desc Get all categories
// @route GET /category
export const getAllCategory = async (req, res, next) => {
  try {
    const allCategores = await getAllCategories();
    res.json(allCategores.rows);
  } catch (err) {
    console.error(err);
  }
}

// desc Get a category
// @route GET /category/:id
export const getACategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await getIdCategory(id);
    res.json(category.rows[0]);
  } catch (err) {
    console.error(err);
  }
}

// desc Update a category
// @route UPDATE /category/:id
export const updateACategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_name, category_image_link } = req.body;
    await updateIdACategory(category_name, category_image_link, id);
    res.json("To do was updated!");
  } catch (err) {
    console.log(err);
  }
}

// desc Delete a category
// @route DELETE /category/:id
export const deleteACategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteIdCategory(id);
    res.json("category was deleted!");
  } catch (err) {
    console.error(err);
  }
}