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
    ShippingAddress varchar(150),
    CONSTRAINT fk_customer_user FOREIGN KEY (UserID) REFERENCES Users (UserID)
);

-- 4. Create Publishers
CREATE TABLE IF NOT EXISTS Publishers
(
    PubID     INT PRIMARY KEY,
    Name      VARCHAR(100) NOT NULL,
    Address   VARCHAR(150)
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
    CartID INT PRIMARY KEY Auto_Increment,
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
    B.Title AS BookTitle,
    TI.Quantity,
    TI.SellingPriceAtTime AS PricePerUnit,
    (TI.Quantity * TI.SellingPriceAtTime) AS LineItemTotal
FROM SalesTransactions ST
         JOIN TransactionItems TI ON ST.TransactionID = TI.TransactionID
         JOIN Books B ON TI.ISBN = B.ISBN;



