CREATE TABLE category (
   category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   category_name VARCHAR(50),
   category_image_link VARCHAR(255)
);

CREATE TABLE item (
  item_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  item_name VARCHAR(50),
  item_desc VARCHAR(100),
  item_price INTEGER,
  item_stock INTEGER,
  item_status BOOLEAN,
  item_image_link VARCHAR(255),
  category_id INTEGER,
  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES category (category_id)
);

INSERT INTO category (category_id, category_image_link) VALUES ($1, $2)