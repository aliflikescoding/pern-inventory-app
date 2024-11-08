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
