 Create Tables
CREATE TABLE Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName TEXT,
    ContactNumber TEXT
);

CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName TEXT,
    Price DECIMAL(10,2),
    StockQuantity INT,
    SupplierID INT,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE Sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    QuantitySold INT,
    SaleDate DATE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

 Add Category Column
ALTER TABLE Products ADD Category TEXT;

 Remove Category Column
ALTER TABLE Products DROP COLUMN Category;

 Modify ContactNumber
ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15);

 Add NOT NULL to ProductName
ALTER TABLE Products MODIFY ProductName TEXT NOT NULL;

 Insert Data
INSERT INTO Suppliers (SupplierName, ContactNumber)
VALUES ('FreshFoods', '01001234567');

INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
VALUES
('Milk', 15.00, 50, 1),
('Bread', 10.00, 30, 1),
('Eggs', 20.00, 40, 1);

INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
VALUES (1, 2, '2025-05-20');

 Update Bread Price
UPDATE Products
SET Price = 25.00
WHERE ProductName = 'Bread';

 Delete Eggs
DELETE FROM Products
WHERE ProductName = 'Eggs';

 Total Quantity Sold for Each Product
SELECT p.ProductName, SUM(s.QuantitySold) AS TotalSold
FROM Products p
LEFT JOIN Sales s ON p.ProductID = s.ProductID
GROUP BY p.ProductName;

 Product with Highest Stock
SELECT ProductName
FROM Products
ORDER BY StockQuantity DESC
LIMIT 1;
 Suppliers Starting with 'F'
SELECT * FROM Suppliers
WHERE SupplierName LIKE 'F%';
 Products Never Sold
SELECT ProductName
FROM Products
WHERE ProductID NOT IN (
    SELECT ProductID FROM Sales
);

 Sales with Product Name
SELECT p.ProductName, s.SaleDate
FROM Sales s
JOIN Products p ON s.ProductID = p.ProductID;

 Create User & Grant Permissions
CREATE USER 'store_manager'@'localhost' IDENTIFIED BY '1234';

GRANT SELECT, INSERT, UPDATE
ON *.*
TO 'store_manager'@'localhost';

 Revoke UPDATE
REVOKE UPDATE
ON *.*
FROM 'store_manager'@'localhost';

 Grant DELETE on Sales Only
GRANT DELETE
ON Sales
TO 'store_manager'@'localhost';


