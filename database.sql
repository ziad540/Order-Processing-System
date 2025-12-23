-- 1. Create the Parent User Table
CREATE DATABASE Booksystem;
USE Booksystem;
CREATE TABLE Users
(
    UserID   INT PRIMARY KEY auto_increment,
    Username VARCHAR(50) UNIQUE  NOT NULL,
    Password VARCHAR(255)        NOT NULL,
    Email    VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE User_Phones
(
    PhoneNumber varchar(20) NOT NULL,
    UserID      INT,
    PRIMARY KEY (PhoneNumber, UserID),
    CONSTRAINT fk_user_phone FOREIGN KEY (UserID) REFERENCES Users (UserID)

);


-- 2. Create Subclass: Admin
CREATE TABLE Admins
(
    UserID INT PRIMARY KEY,
    CONSTRAINT fk_admin_user FOREIGN KEY (UserID) REFERENCES Users (UserID)
);

-- 3. Create Subclass: Customer
CREATE TABLE Customers
(
    UserID          INT PRIMARY KEY,
    FirstName       VARCHAR(50),
    LastName        VARCHAR(50),
    ShippingAddress varchar(150),
    CONSTRAINT fk_customer_user FOREIGN KEY (UserID) REFERENCES Users (UserID)
);

-- 4. Create Publishers
CREATE TABLE Publishers
(
    PubID     INT PRIMARY KEY,
    Name      VARCHAR(100) NOT NULL,
    Address   VARCHAR(150),
    Telephone VARCHAR(20)
);

CREATE TABLE Publisher_phone
(
    PhoneNumber varchar(20) NOT NULL,
    PubID       INT,
    PRIMARY KEY (PhoneNumber, PubID),
    CONSTRAINT fk_publisher_phone FOREIGN KEY (PubID) REFERENCES Publishers (PubID)

);


-- 5. Create Books
CREATE TABLE Books
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
    CONSTRAINT fk_book_publisher FOREIGN KEY (PubID) REFERENCES Publishers (PubID)
);

-- 6. Create Credit Cards (Owned by Customer)
CREATE TABLE CreditCards
(
    CardNum    VARCHAR(20) PRIMARY KEY,
    ExpiryDate DATE NOT NULL,
    UserID     INT  NOT NULL,
    CONSTRAINT fk_card_owner FOREIGN KEY (UserID) REFERENCES Customers (UserID)
);


CREATE TABLE ShoppingCarts
(
    CartID INT PRIMARY KEY auto_increment,
    UserID INT UNIQUE NOT NULL,
    CONSTRAINT fk_cart_owner FOREIGN KEY (UserID) REFERENCES Customers (UserID)
);


CREATE TABLE CartItems
(
    CartID   INT         NOT NULL,
    ISBN     VARCHAR(20) NOT NULL,
    Quantity INT DEFAULT 1,
    PRIMARY KEY (CartID, ISBN),
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (CartID) REFERENCES ShoppingCarts (CartID),
    CONSTRAINT fk_cart_item_book FOREIGN KEY (ISBN) REFERENCES Books (ISBN)
);


CREATE TABLE ReplenishmentOrders
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


CREATE TABLE SalesTransactions
(
    TransactionID   INT PRIMARY KEY AUTO_INCREMENT,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount     DECIMAL(12, 2),
    UserID          INT         NOT NULL,
    CardNum         VARCHAR(20) NOT NULL,
    CONSTRAINT fk_trans_customer FOREIGN KEY (UserID) REFERENCES Customers (UserID),
    CONSTRAINT fk_trans_card FOREIGN KEY (CardNum) REFERENCES CreditCards (CardNum)
);


CREATE TABLE TransactionItems
(
    TransactionID      INT            NOT NULL,
    ISBN               VARCHAR(20)    NOT NULL,
    Quantity           INT            NOT NULL,
    SellingPriceAtTime DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (TransactionID, ISBN),
    CONSTRAINT fk_trans_item_trans FOREIGN KEY (TransactionID) REFERENCES SalesTransactions (TransactionID),
    CONSTRAINT fk_trans_item_book FOREIGN KEY (ISBN) REFERENCES Books (ISBN)
);