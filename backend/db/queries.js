import pool from "./pool.js";

export async function insertIntoCategory(category_name, category_image_link) {
  const result = await pool.query(
    "INSERT INTO category (category_name, category_image_link) VALUES ($1, $2)",
    [category_name, category_image_link]
  );
  return result;
}

export async function getAllCategories() {
  const result = await pool.query("SELECT * FROM category");
  return result;
}

export async function getIdCategory(category_id) {
  const result = await pool.query(
    "SELECT * FROM category WHERE category_id = ($1)",
    [category_id]
  );
  return result;
}

export async function updateIdACategory(
  category_name,
  category_image_link,
  category_id
) {
  const result = await pool.query(
    "UPDATE category SET category_name = $1, category_image_link = $2 WHERE category_id = $3",
    [category_name, category_image_link, category_id]
  );
  return result;
}

export async function deleteIdCategory(category_id) {
  const result = await pool.query(
    "DELETE FROM category WHERE category_id = $1",
    [category_id]
  );
  return result;
}

export async function insertIntoItem(
  item_name,
  item_desc,
  item_price,
  item_stock,
  item_status,
  item_image_link,
  category_id
) {
  const result = await pool.query(
    `INSERT INTO item (item_name, item_desc, item_price, item_stock, item_status, item_image_link, category_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      category_id,
    ]
  );
  return result;
}

export async function getAllItems() {
  const result = await pool.query("SELECT * FROM item");
  return result;
}

export async function getIdItem(item_id) {
  const result = await pool.query("SELECT * FROM item WHERE item_id = ($1)", [
    item_id,
  ]);
  return result;
}

export async function updateIdItem(
  item_id,
  item_name,
  item_desc,
  item_price,
  item_stock,
  item_status,
  item_image_link,
  category_id
) {
  const result = await pool.query(
    `UPDATE item 
     SET item_name = $1, 
         item_desc = $2, 
         item_price = $3, 
         item_stock = $4, 
         item_status = $5, 
         item_image_link = $6, 
         category_id = $7
     WHERE item_id = $8
     RETURNING *`,
    [
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      category_id,
      item_id,
    ]
  );
  return result;
}

export async function updateCategoryItem(
  item_id,
  item_name,
  item_desc,
  item_price,
  item_stock,
  item_status,
  item_image_link,
) {
  const result = await pool.query(
    `UPDATE item 
     SET item_name = $1, 
         item_desc = $2, 
         item_price = $3, 
         item_stock = $4, 
         item_status = $5, 
         item_image_link = $6
     WHERE item_id = $7
     RETURNING *`,
    [
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      item_id,
    ]
  );
  return result;
}

export async function deleteIdItem(item_id) {
  const result = await pool.query("DELETE FROM item WHERE item_id = $1", [
    item_id,
  ]);
  return result;
}

export async function getCategoryItems(category_id) {
  const result = await pool.query("SELECT * FROM item WHERE category_id = $1", [
    category_id,
  ]);
  return result;
}

export async function getAllItemsWithNames() {
  const result = await pool.query(
    `SELECT 
      item_id,
      item_name,
      item_desc,
      item_price,
      item_stock,
      item_status,
      item_image_link,
      category_name
     FROM 
        item
     JOIN 
        category 
     ON 
        item.category_id = category.category_id;`
  );
  return result;
}

