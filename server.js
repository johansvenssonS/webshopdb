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

/* 
CREATE
 */

app.post("/products", async (req, res) => {
    const { name, price, stock } = req.body;

    if (!name || price == null || stock == null) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const [result] = await db.promise().query(
            `INSERT INTO products (name, price, stock)
      VALUES (?, ?, ?)`,
            [name, price, stock],
        );

        res.status(201).json({ id_product: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Insert failed" });
    }
    /*  try {
        const { name, price, stock } = req.body;
        const [result] = await db
            .promise()
            .query("INSERT INTO products (name, price, stock) VALUES (?,?,?)", [
                name,
                price,
                stock,
            ]);
        res.status(201).json({
            id: result.insertId,
            name,
            price,
            stock,
        });
    } catch (err) {
        res.status(500).json({ error: "Kunde inte lägga till produkt" });
    } */
});

/* 
READ 
*/

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db
            .promise()
            .query("SELECT * FROM products WHERE id_product = ?", [id]);

        if (rows.length === 0)
            return res.status(404).json({ message: "Not found" });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Fetch failed" });
    }
});

/* app.get("/products", async (req, res) => {
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
}); */

/* 
UPDATE 
*/

app.patch("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    if (!name && price == null && stock == null) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    const fields = [];
    const values = [];

    if (name) {
        fields.push("name = ?");
        values.push(name);
    }
    if (price != null) {
        fields.push("price = ?");
        values.push(price);
    }
    if (stock != null) {
        fields.push("stock = ?");
        values.push(stock);
    }

    values.push(id);

    try {
        const [result] = await db
            .promise()
            .query(
                `UPDATE products SET ${fields.join(", ")} WHERE id_product = ?`,
                values,
            );

        res.json({ updatedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
});

/* 
DELETE
*/

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db
            .promise()
            .query("DELETE FROM products WHERE id_product = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json({ deletedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});
