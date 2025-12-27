-- 1. Create the Parent User Table
CREATE DATABASE IF NOT EXISTS Booksystem ;
USE Booksystem;
CREATE TABLE IF NOT EXISTS Users
(
    UserID   INT PRIMARY KEY auto_increment,
    Username VARCHAR(50) UNIQUE  NOT NULL,
    Password VARCHAR(255)        NOT NULL,
    Email    VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS User_Phones
(
    PhoneNumber varchar(20) NOT NULL,
    UserID      INT,
    PRIMARY KEY (PhoneNumber, UserID),
    CONSTRAINT fk_user_phone FOREIGN KEY (UserID) REFERENCES Users (UserID)

);


-- 2. Create Subclass: Admin
CREATE TABLE IF NOT EXISTS Admins
(
    UserID INT PRIMARY KEY,
    CONSTRAINT fk_admin_user FOREIGN KEY (UserID) REFERENCES Users (UserID)
);

-- 3. Create Subclass: Customer
CREATE TABLE IF NOT EXISTS Customers
(
    UserID          INT PRIMARY KEY,
    FirstName       VARCHAR(50),
    LastName        VARCHAR(50),
    ShippingAddress varchar(500),
    CONSTRAINT fk_customer_user FOREIGN KEY (UserID) REFERENCES Users (UserID)
);

-- 4. Create Publishers
CREATE TABLE IF NOT EXISTS Publishers
(
    PubID     INT PRIMARY KEY,
    Name      VARCHAR(100) NOT NULL,
    Address   VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Publisher_phone
(
    PhoneNumber varchar(20) NOT NULL,
    PubID       INT,
    PRIMARY KEY (PhoneNumber, PubID),
    CONSTRAINT fk_publisher_phone FOREIGN KEY (PubID) REFERENCES Publishers (PubID)

);


-- 5. Create Books
CREATE TABLE IF NOT EXISTS Books
(
    ISBN         VARCHAR(20) PRIMARY KEY,
    Title        VARCHAR(150)   NOT NULL,
    Author       VARCHAR(100)   NOT NULL,
    Pub_Year     INT            NOT NULL,
    SellingPrice DECIMAL(10, 2) NOT NULL,
    Category     VARCHAR(50)    NOT NULL,
    PubID        INT            NOT NULL,
    StockLevel   INT            NOT NULL,
    threshold    INT            NOT NULL,
    coverImage   LONGTEXT,
    CONSTRAINT fk_book_publisher FOREIGN KEY (PubID) REFERENCES Publishers (PubID)
);

-- 6. Create Credit Cards (Owned by Customer)
CREATE TABLE IF NOT EXISTS CreditCards
(
    CardNum    VARCHAR(20) PRIMARY KEY,
    ExpiryDate DATE NOT NULL,
    UserID     INT  NOT NULL,
    CONSTRAINT fk_card_owner FOREIGN KEY (UserID) REFERENCES Customers (UserID)
);


CREATE TABLE IF NOT EXISTS ShoppingCarts
(
    CartID INT PRIMARY KEY,
    UserID INT UNIQUE NOT NULL,
    CONSTRAINT fk_cart_owner FOREIGN KEY (UserID) REFERENCES Customers (UserID)
);


CREATE TABLE IF NOT EXISTS CartItems
(
    CartID   INT         NOT NULL,
    ISBN     VARCHAR(20) NOT NULL,
    Quantity INT DEFAULT 1,
    PRIMARY KEY (CartID, ISBN),
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (CartID) REFERENCES ShoppingCarts (CartID),
    CONSTRAINT fk_cart_item_book FOREIGN KEY (ISBN) REFERENCES Books (ISBN)
);


CREATE TABLE IF NOT EXISTS ReplenishmentOrders
(
    OrderID           INT PRIMARY KEY AUTO_INCREMENT,
    OrderDate         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    OrderStatus       VARCHAR(50) NOT NULL,
    QuantityRequested INT         NOT NULL,
    AdminID           INT         NOT NULL,
    PubID             INT         NOT NULL,
    ISBN              VARCHAR(20) NOT NULL,
    CONSTRAINT fk_order_admin FOREIGN KEY (AdminID) REFERENCES Admins (UserID),
    CONSTRAINT fk_order_pub FOREIGN KEY (PubID) REFERENCES Publishers (PubID),
    CONSTRAINT fk_order_book FOREIGN KEY (ISBN) REFERENCES Books (ISBN)
);


CREATE TABLE IF NOT EXISTS SalesTransactions
(
    TransactionID   INT PRIMARY KEY AUTO_INCREMENT,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount     DECIMAL(12, 2),
    UserID          INT         NOT NULL,
    CardNum         VARCHAR(20) NOT NULL,
    CONSTRAINT fk_trans_customer FOREIGN KEY (UserID) REFERENCES Customers (UserID),
    CONSTRAINT fk_trans_card FOREIGN KEY (CardNum) REFERENCES CreditCards (CardNum)
);


CREATE TABLE IF NOT EXISTS TransactionItems
(
    TransactionID      INT            NOT NULL,
    ISBN               VARCHAR(20)    NOT NULL,
    Quantity           INT            NOT NULL,
    SellingPriceAtTime DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (TransactionID, ISBN),
    CONSTRAINT fk_trans_item_trans FOREIGN KEY (TransactionID) REFERENCES SalesTransactions (TransactionID),
    CONSTRAINT fk_trans_item_book FOREIGN KEY (ISBN) REFERENCES Books (ISBN)
);


CREATE TABLE IF NOT EXISTS Authors (

    AuthorName     varchar(100) NOT NULL ,
    BookISBN       VARCHAR(20)   ,
    primary key (AuthorName,BookISBN),
    CONSTRAINT fk_book   FOREIGN KEY (BookISBN) REFERENCES Books (ISBN)


);

DELIMITER //

CREATE TRIGGER TR_OrderItems_DeductStock
    AFTER INSERT ON TransactionItems
    FOR EACH ROW
BEGIN
    UPDATE Books
    SET StockLevel = StockLevel - NEW.Quantity
    WHERE ISBN = NEW.ISBN;

    -- Note: MySQL will also trigger any constraints or
    -- additional triggers defined on the 'Book' table automatically.
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER TR_Books_PreventNegativeStock
    BEFORE UPDATE ON Books
    FOR EACH ROW
BEGIN
    IF NEW.StockLevel < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Transaction cancelled: Insufficient stock available.';
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER TR_Books_AutoReplenish
    AFTER UPDATE ON Books
    FOR EACH ROW
BEGIN
    -- Check if stock fell below threshold and an order doesn't already exist
    IF NEW.StockLevel <= NEW.threshold AND OLD.StockLevel > NEW.threshold THEN
        INSERT INTO ReplenishmentOrders (OrderStatus, QuantityRequested, AdminID, PubID, ISBN)
        VALUES ('Pending', 30, 1, NEW.PubID, NEW.ISBN);
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER TR_Sales_ClearCart
    AFTER INSERT ON SalesTransactions
    FOR EACH ROW
BEGIN
    -- Locate the CartID for this User
    DELETE CI FROM CartItems CI
                       JOIN ShoppingCarts SC ON CI.CartID = SC.CartID
    WHERE SC.UserID = NEW.UserID;
END //

DELIMITER ;


CREATE VIEW View_Sales_LastMonth AS
SELECT
    IFNULL(SUM(TotalAmount), 0) AS TotalRevenue,
    COUNT(TransactionID) AS TotalTransactions,
    DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%M %Y') AS ReportingMonth
FROM SalesTransactions
WHERE TransactionDate >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
  AND TransactionDate < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01');

CREATE VIEW View_Top5Customers_3Months AS
SELECT
    C.UserID,
    C.FirstName,
    C.LastName,
    COUNT(ST.TransactionID) AS OrdersPlaced,
    SUM(ST.TotalAmount) AS TotalSpent
FROM SalesTransactions ST
         JOIN Customers C ON ST.UserID = C.UserID
WHERE ST.TransactionDate >= CURRENT_DATE - INTERVAL 3 MONTH
GROUP BY C.UserID, C.FirstName, C.LastName
ORDER BY TotalSpent DESC
LIMIT 5;


CREATE VIEW View_Top10Books_3Months AS
SELECT
    B.ISBN,
    B.Title,
    SUM(TI.Quantity) AS TotalCopiesSold,
    B.StockLevel AS CurrentStock
FROM TransactionItems TI
         JOIN SalesTransactions ST ON TI.TransactionID = ST.TransactionID
         JOIN Books B ON TI.ISBN = B.ISBN
WHERE ST.TransactionDate >= CURRENT_DATE - INTERVAL 3 MONTH
GROUP BY B.ISBN, B.Title, B.StockLevel
ORDER BY TotalCopiesSold DESC
LIMIT 10;




CREATE VIEW View_OrderHistory AS
SELECT
    ST.UserID,
    ST.TransactionID,
    ST.TransactionDate,
    ST.TotalAmount AS OrderTotal,
    TI.ISBN,
    B.Title AS BookTitle,
    B.Author,
    TI.Quantity,
    TI.SellingPriceAtTime AS PricePerUnit,
    (TI.Quantity * TI.SellingPriceAtTime) AS LineItemTotal
FROM SalesTransactions ST
         JOIN TransactionItems TI ON ST.TransactionID = TI.TransactionID
         JOIN Books B ON TI.ISBN = B.ISBN;

USE booksystem;
INSERT INTO Publishers (PubID, Name, Address)
VALUES (1, 'O Reilly Media', '1005 Gravenstein Hwy N, Sebastopol, CA'),
       (2, 'Pearson Education', '330 Hudson St, New York, NY'),
       (3, 'Penguin Random House', '1745 Broadway, New York, NY');

INSERT INTO Publisher_phone (PhoneNumber, PubID)
VALUES ('800-998-9938', 1),
       ('800-848-9500', 2),
       ('212-782-9000', 3);

INSERT INTO Users (UserID, Username, Password, Email)
VALUES (1, 'admin_sarah', 'hashed_pass_123', 'sarah.admin@booksys.com'),
       (2, 'john_doe', 'secure_pass_456', 'john.doe@gmail.com'),
       (3, 'jane_smith', 'mypassword789', 'jane.smith@yahoo.com');

INSERT INTO User_Phones (PhoneNumber, UserID)
VALUES ('555-0101', 1),
       ('555-0202', 2),
       ('555-0303', 3);


-- Link User 1 to Admin
INSERT INTO Admins (UserID)
VALUES (1);

-- Link Users 2 and 3 to Customers
INSERT INTO Customers (UserID, FirstName, LastName, ShippingAddress)
VALUES (2, 'John', 'Doe', '123 Maple Street, Springfield, IL'),
       (3, 'Jane', 'Smith', '456 Oak Avenue, Metropolis, NY');



INSERT INTO Books (ISBN, Title, Author, Pub_Year, SellingPrice, Category, PubID, StockLevel, threshold)
VALUES ('978-1491950357', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 2017, 45.99, 'Science', 1, 10,
        5),
       ('978-0131103627', 'The C Programming Language', 'Brian Kernighan', 1988, 55.00, 'Technology', 2, 8, 3),
       ('978-0321125217', 'Domain-Driven Design', 'Eric Evans', 2003, 52.50, 'Technology', 2, 2,
        5), -- Low stock example
       ('978-0735619678', 'Code Complete', 'Steve McConnell', 2004, 35.00, 'Science', 1, 15, 5);


-- Credit Cards for Customers
INSERT INTO CreditCards (CardNum, ExpiryDate, UserID)
VALUES ('1111-2222-3333-4444', '2026-12-31', 2),
       ('5555-6666-7777-8888', '2025-06-30', 3);

-- Empty Shopping Carts for Customers
INSERT INTO ShoppingCarts (CartID, UserID)
VALUES (100, 2),
       (101, 3);

INSERT INTO CartItems (CartID, ISBN, Quantity)
VALUES (100, '978-1491950357', 1),
       (100, '978-0131103627', 2);


INSERT INTO SalesTransactions (TransactionID, TotalAmount, UserID, CardNum)
VALUES (500, 52.50, 3, '5555-6666-7777-8888');

INSERT INTO TransactionItems (TransactionID, ISBN, Quantity, SellingPriceAtTime)
VALUES (500, '978-0321125217', 1, 52.50);



INSERT INTO ReplenishmentOrders (OrderStatus, QuantityRequested, AdminID, PubID, ISBN) VALUES
    ('Pending', 50, 1, 2, '978-0321125217');

INSERT INTO Books (ISBN, Title, Author, Pub_Year, SellingPrice, Category, PubID, StockLevel, threshold) VALUES
-- Tech & CS Books (Mapped to Pearson & O'Reilly)
('978-0133591620', 'Modern Operating Systems', 'Andrew S. Tanenbaum', 2014, 85.00, 'Technology', 2, 12, 5),
('978-0073523323', 'Database System Concepts', 'Abraham Silberschatz', 2010, 92.50, 'Technology', 2, 7, 4),
('978-0262033848', 'Introduction to Algorithms', 'Thomas H. Cormen', 2009, 75.00, 'Science', 2, 20, 5),
('978-0596007126', 'Head First Design Patterns', 'Eric Freeman', 2004, 49.99, 'Technology', 1, 15, 5),
('978-0132350884', 'Clean Code', 'Robert C. Martin', 2008, 42.00, 'Technology', 2, 4, 10), -- Below threshold example
('978-1449331818', 'Learning Python', 'Mark Lutz', 2013, 59.99, 'Technology', 1, 30, 5),

-- Science & Fiction (Mapped to Penguin Random House)
('978-0553380163', 'A Brief History of Time', 'Stephen Hawking', 1988, 18.00, 'Science', 3, 50, 10),
('978-0743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 10.99, 'Fiction', 3, 100, 20),
('978-0451524935', '1984', 'George Orwell', 1949, 12.50, 'Fiction', 3, 85, 15),
('978-0307277671', 'The Da Vinci Code', 'Dan Brown', 2003, 15.99, 'Fiction', 3, 40, 10);