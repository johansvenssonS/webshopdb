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

db.getConnection((err, connection) => {
  if (err) {
    console.error("Databaskoppling MISSLYCKADES:", err.message);
    process.exit(1);
  } else {
    console.log("✓ Databaskoppling LYCKADES!");
    connection.release();
  }
});

app.listen(3000, () => console.log("Servern Körs"));

app.get("/products", async (req, res) => {
  try {
    // const [dbNameRows] = await db.promise().query("SELECT DATABASE() AS db");
    // console.log("Connected DB:", dbNameRows[0]?.db);
    // const [tables] = await db.promise().query("SHOW TABLES");
    // console.log("SHOW TABLES:", tables);
    const [rows] = await db.promise().query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Error vid hämtning av produkter:", error);
    res.status(500).json({ error: "Databas fel/error" });
  }
});
app.get("/customer", async (req, res) => {
  try {
    // const [dbNameRows] = await db.promise().query("SELECT DATABASE() AS db");
    // console.log("Connected DB:", dbNameRows[0]?.db);
    // const [tables] = await db.promise().query("SHOW TABLES");
    // console.log("SHOW TABLES:", tables);
    const [rows] = await db.promise().query("SELECT * FROM customer");
    res.json(rows);
  } catch (error) {
    console.error("Error vid hämtning av kunder:", error);
    res.status(500).json({ error: "Databas fel/error" });
  }
});
app.get("/order", async (req, res) => {
  try {
    // const [dbNameRows] = await db.promise().query("SELECT DATABASE() AS db");
    // console.log("Connected DB:", dbNameRows[0]?.db);
    // const [tables] = await db.promise().query("SHOW TABLES");
    // console.log("SHOW TABLES:", tables);
    const [rows] = await db.promise().query("SELECT * FROM `order`");
    res.json(rows);
  } catch (error) {
    console.error("Error vid hämtning av ordrar:", error);
    res.status(500).json({ error: "Databas fel/error" });
  }
});
