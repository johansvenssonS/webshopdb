# webshopdb

webshopdb

//Behövde göra inserts, kunde inte hitta mysql workbench. http://localhost:3000/products
// CREATE TABLE products (
// id_product INT PRIMARY KEY AUTO_INCREMENT,
// name VARCHAR(255) NOT NULL,
// price DECIMAL(10, 2) NOT NULL,
// stock INT NOT NULL
// );

// INSERT INTO products (name, price, stock) VALUES
// ('Smartphone X', 8999, 50),
// ('Laptop Pro', 15500, 15),
// ('Bluetooth Headphones', 1200, 100),
// ('USB-C Hub', 450, 200);

# webshopdb - Databaskoppling Guide

## Problem: "Access denied" när man ansluter från WSL till Windows MySQL

### Lösning

**Steg 1: I MySQL Workbench (Windows), skapa remote-användaren**

```sql
CREATE USER 'webshopdb'@'192.168.0.xxx' IDENTIFIED BY 'webshop_pass';
GRANT ALL PRIVILEGES ON webshopdb.* TO 'webshopdb'@'192.168.0.xxx';
FLUSH PRIVILEGES;
```

**Steg 2: Uppdatera .env i WSL**

```
DB_HOST=192.168.0.xxx
DB_USER=webshopdb
DB_PASSWORD=webshop_pass
DB_NAME=webshopdb
PORT=3306
```

**Steg 3: Från WSL terminal, testa anslutningen**

```bash
mysql -h 192.168.0.XXX -u webshopdb -pwebshop_pass webshopdb
SHOW TABLES;
```

**Steg 4: Starta Node.js server**

```bash
node server.js
```

Testa: `http://localhost:3000/products`

### Vanliga fel

- **ERROR 1045**: Fel lösenord eller användarnamn
- **ERROR 1044**: Användaren har inte rättigheter till databasen
- **Connection refused**: Fel IP-adress (använd `ipconfig` i Windows för att hitta rätt IP)

### Windows IP-adress

För att hitta din Windows-IP, öppna Command Prompt och kör:

```cmd
ipconfig
```

Leta efter "IPv4 Address" - det är något typ: `192.168.x.x`
