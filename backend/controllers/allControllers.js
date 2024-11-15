import {
  insertIntoCategory,
  getAllCategories,
  getIdCategory,
  updateIdACategory,
  deleteIdCategory,
  insertIntoItem,
  getAllItems,
  getIdItem,
  updateIdItem,
  deleteIdItem,
  getCategoryItems,
  getAllItemsWithNames
} from "../db/queries.js";

// desc Post a category
// @route POST /category
export const postACategory = async (req, res, next) => {
  try {
    const { category_name, category_image_link } = req.body;
    const newCategory = await insertIntoCategory(
      category_name,
      category_image_link
    );
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err);
  }
};

// desc Get all categories
// @route GET /category
export const getAllCategory = async (req, res, next) => {
  try {
    const allCategores = await getAllCategories();
    res.json(allCategores.rows);
  } catch (err) {
    console.error(err);
  }
};

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
};

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
};

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
};

// desc Create an item
// @route CREATE /item
export const createItem = async (req, res, next) => {
  try {
    const {
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      category_id,
    } = req.body;
    const newItem = await insertIntoItem(
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      category_id
    );
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err);
  }
};

// desc Get all categories
// @route GET /category
export const getAllItem = async (req, res, next) => {
  try {
    const allItems = await getAllItems();
    res.json(allItems.rows);
  } catch (err) {
    console.error(err);
  }
};

// desc Get an item
// @route GET /category/:id
export const getAnItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await getIdItem(id);
    res.json(item.rows[0]);
  } catch (err) {
    console.error(err);
  }
};

// desc Update a item
// @route UPDATE /item/:id
export const updateAnItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      category_id,
    } = req.body;
    await updateIdItem(
      id,
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      category_id
    );
    res.json("Item was updated!");
  } catch (err) {
    console.log(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteIdItem(id);
    res.json("Item was deleted!");
  } catch (err) {
    console.error(err);
  }
}

export const getItemsBasedOnCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await getCategoryItems(id);
    res.json(items.rows);
  } catch (err) {
    console.error(err);
  }
}

// desc Get all items with category name
// @route GET /itemwithcatname
export const getAllItemsWithCatName = async (req, res, next) => {
  try {
    const allItems = await getAllItemsWithNames();
    res.json(allItems.rows);
  } catch (err) {
    console.error(err);
  }
};