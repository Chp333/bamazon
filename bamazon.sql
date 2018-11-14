DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptops", "Electronics", 1699, 28), ("Crayons", "School", 1.68, 125), ("Chair", "Furniture", 48.52, 100), ("Table", "Furniture", 124.57, 3), ("Notebook", "School", 1.50, 211), ("Phone Charger", "Electronics", 13.57, 31), ("Desktop", "Electronics", 699, 46), ("Socks", "Apperal", 4.12, 206), ("Bathing Suit", "Swim Wear", 64.21, 99), ("Shorts", "Apperal", 22.76, 3), ("Tank Top", "Apperal", 12.76, 49);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Laptops", "Electronics", 1699, 28);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Crayons", "School", 1.68, 125);
 
-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("Chair", "Furniture", 48.52, 100);
