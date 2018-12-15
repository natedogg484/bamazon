DROP DATABASE IF EXISTS bmazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  productname VARCHAR(45) NOT NULL,
  productprice INTEGER(10) NOT NULL,
  department VARCHAR(20) NOT NULL,
  stock INTEGER(10) NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO items (productname, productprice, department, stock)
VALUES ("Socks", 1, "Clothing", 55), ("Adidas Sneakers", 55, "Apparel", 23), ("Slow Cooker", 40, "Cookware", 13), ("iPhone Case", 15, "Acessories", 85), ("Game of Thrones", 19, "Books", 235), ("Elf on a Shelf", 13, "Decoration", 94), ("Pizza Cutter", 8, "Decoration", 18);