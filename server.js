const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.listen(3000, () => console.log("Servern Körs"));

app.get("/products", async (req, res) => {
  try {
    const [dbNameRows] = await db.promise().query("SELECT DATABASE() AS db");
    console.log("Connected DB:", dbNameRows[0]?.db);
    const [tables] = await db.promise().query("SHOW TABLES");
    console.log("SHOW TABLES:", tables);
    const [rows] = await db.promise().query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Error vid hämtning av produkter:", error);
    res.status(500).json({ error: "Databas fel/error" });
  }
});

//Behövde göra inserts, kunde inte hitta mysql workbench. http://localhost:3000/products
// CREATE TABLE products (
//   id_product INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(255) NOT NULL,
//   price DECIMAL(10, 2) NOT NULL,
//   stock INT NOT NULL
// );

// INSERT INTO products (name, price, stock) VALUES
// ('Smartphone X', 8999, 50),
// ('Laptop Pro', 15500, 15),
// ('Bluetooth Headphones', 1200, 100),
// ('USB-C Hub', 450, 200);
