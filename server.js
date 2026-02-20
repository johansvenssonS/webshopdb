const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false,
    },
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
    const { name, price, stock, id_category } = req.body;

    if (!name || price == null || stock == null || !id_category) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const [result] = await db.promise().query(
            `INSERT INTO products (name, price, stock, id_category)
      VALUES (?, ?, ?, ?)`,
            [name, price, stock, id_category],
        );

        res.status(201).json({
            message: "Product created",
            id_product: result.insertId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
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

app.post("/orders/", async (req, res) => {
  const { id_customer, total_amount, id_product, order_qty, payment_method } =
    req.body;
  try {
    /// Först skapa ordern i orders tabellen.
    const [result] = await db
      .promise()
      .query(`INSERT INTO orders (id_customer, total_amount) VALUES (?, ?)`, [
        id_customer,
        total_amount,
      ]);
    /// Använder de id som används i orders tabell till att skapa orderproduct inserts.
    const id_order = result.insertId;
    /// Skapa orderproduct insert.
    await db
      .promise()
      .query(
        `INSERT INTO orderproduct (id_order, id_product, order_qty, payment_method) VALUES (?, ?, ?, ?)`,
        [id_order, id_product, order_qty, payment_method],
      );
    res.status(201).json({ message: "Order skapad", id_order });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte skapa order" });
  }
  //exempel på request i Postman
  //   {
  //   "id_customer": 1,
  //   "total_amount": 12999,
  //   "id_product": 1,
  //   "order_qty": 1,
  //   "payment_method": "card"
  // }
});

/* 
READ 
*/

/* Product Search */

app.get("/products/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM products WHERE name LIKE ?" /* AND stock > 0 */, [
        `%${q}%`,
      ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

///Hämta alla produkter.
app.get("/products", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM products");

    if (rows.length === 0)
      return res.status(404).json({ message: "Not found" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

//Få detaljerad info om enskild produkt,
//J
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      `SELECT products.*, productdescription.desc, productdescription.specs, productdescription.image
       FROM products 
       JOIN productdescription ON products.id_product = productdescription.id_product
       WHERE products.id_product = ?`,
      [id],
    );

        if (rows.length === 0)
            return res.status(404).json({ message: "Not found" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// Söka efter produkter med kategeri
app.get("/category/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db
            .promise()
            .query("SELECT * FROM products WHERE id_category = ?", [id]);

        if (rows.length === 0)
            return res.status(404).json({ message: "Not found" });

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Fetch failed" });
    }
});
// Söka efter order med ett specfikt id,
// JOIN ihop relevant info från orders, orderproduct tabeller.
app.get("/orders/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.promise().query(
            `SELECT orders.*, orderproduct.id_product, orderproduct.order_qty,
        orderproduct.payment_method, orderproduct.payment_status 
        FROM orders 
        JOIN orderproduct ON orders.id_order = orderproduct.id_order
        WHERE orders.id_order = ?`,
            [id],
        );

        if (rows.length === 0)
            return res.status(404).json({ message: "Not found" });

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Fetch failed" });
    }
});

/* Get Avaiable Products */

app.get("/products", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM products WHERE stock > 0");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Databasfel" });
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
