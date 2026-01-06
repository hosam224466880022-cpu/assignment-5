const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // غيرها لو عندك user مختلف
  password: "",        // حط باسورد MySQL
  database: "retail_store"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// =======================
// Create Tables
// =======================
app.get("/createTables", (req, res) => {
  const suppliersTable = `
    CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT AUTO_INCREMENT PRIMARY KEY,
      SupplierName TEXT,
      ContactNumber VARCHAR(15)
    );
  `;

  const productsTable = `
    CREATE TABLE IF NOT EXISTS Products (
      ProductID INT AUTO_INCREMENT PRIMARY KEY,
      ProductName TEXT NOT NULL,
      Price DECIMAL(10,2),
      StockQuantity INT,
      SupplierID INT,
      FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    );
  `;

  const salesTable = `
    CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT AUTO_INCREMENT PRIMARY KEY,
      ProductID INT,
      QuantitySold INT,
      SaleDate DATE,
      FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    );
  `;

  db.query(suppliersTable);
  db.query(productsTable);
  db.query(salesTable);

  res.send("Tables created successfully");
});

// =======================
// Insert Supplier
// =======================
app.post("/addSupplier", (req, res) => {
  const { name, contact } = req.body;
  const sql = "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)";

  db.query(sql, [name, contact], (err) => {
    if (err) return res.send(err);
    res.send("Supplier added successfully");
  });
});

// =======================
// Insert Product
// =======================
app.post("/addProduct", (req, res) => {
  const { name, price, stock, supplierId } = req.body;
  const sql = `
    INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, price, stock, supplierId], (err) => {
    if (err) return res.send(err);
    res.send("Product added successfully");
  });
});

// =======================
// Add Sale
// =======================
app.post("/addSale", (req, res) => {
  const { productId, quantity, date } = req.body;
  const sql = `
    INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [productId, quantity, date], (err) => {
    if (err) return res.send(err);
    res.send("Sale added successfully");
  });
});

// =======================
// Get Total Quantity Sold
// =======================
app.get("/totalSales", (req, res) => {
  const sql = `
    SELECT p.ProductName, SUM(s.QuantitySold) AS TotalSold
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    GROUP BY p.ProductName
  `;

  db.query(sql, (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// =======================
// Server
// =======================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
