# Order Processing System - Requirements Document

## Project Overview
A simplified online bookstore system supporting two user types: **Administrators** and **Customers**. The system manages books, publishers, stock levels, orders, sales transactions, shopping carts, and user accounts.

---

## Part 1: Core System Requirements

### 1. Database Entities

#### Books
- ISBN number (Primary Key)
- Title
- Author(s) - multiple authors per book supported
- Publisher
- Publication year
- Selling price
- Category: Must be one of:
  - Science
  - Art
  - Religion
  - History
  - Geography
- Quantity in stock
- Threshold (minimum quantity to maintain)

#### Publishers
- Publisher name
- Address
- Telephone number

#### Orders (From Publishers)
- Order details and information
- Order status (Pending/Confirmed)
- Order quantity
- Related book ISBN
- Order date

---

### 2. Administrator Functions

#### 2.1 Add New Books
- Admin enters all book properties
- Must specify threshold (minimum stock quantity)
- Full integrity validation required
- **Access Level:** Admin Only

#### 2.2 Modify Existing Books
- Search for book before updating
- Update stock quantity when books are sold
- **Constraint:** Cannot update if result would be negative quantity
- **Implementation:** Trigger before update
- **Access Level:** Admin Only

#### 2.3 Place Orders on Books
- Automatic order placement when stock drops below threshold
- Triggered after update on books table
- Order quantity is constant (predefined)
- **Implementation:** Trigger after update
- **Access Level:** Admin Only

#### 2.4 Confirm Orders
- Confirm orders when receiving books from publisher
- Automatically add ordered quantity to stock upon confirmation
- Update order status to "Confirmed"
- **Access Level:** Admin Only

#### 2.5 Search for Books
- Search by ISBN
- Search by title
- Search by category
- Search by author
- Search by publisher
- Returns book details and availability
- **Access Level:** Admin and Customer

#### 2.6 System Reports
All reports are **Admin Only**:

**a) Total Sales for Previous Month**
- Summarizes all sales from the month before current date

**b) Total Sales for Specific Day**
- Admin inputs a date
- System returns total sales for that date

**c) Top 5 Customers (Last 3 Months)**
- Ranked by total purchase amount
- Descending order

**d) Top 10 Selling Books (Last 3 Months)**
- Ranked by total number of copies sold
- Descending order

**e) Total Orders for Specific Book**
- Shows how many times admin placed replenishment orders for a book

---

## Part 2: Customer Account & Online Shopping Features

### 3. User Registration & Authentication

#### Sign Up (New Customers)
Required information:
- Username
- Password
- First name
- Last name
- Email address
- Phone number
- Shipping address

#### Login
- Only registered users can log in

---

### 4. Customer Functions

#### 4.1 Edit Personal Information
- Update any personal details
- Change password
- **Access Level:** Registered Customer

#### 4.2 Search for Books
- Same search capabilities as admin users
- Search by ISBN, title, category, author, or publisher
- **Access Level:** Registered Customer

#### 4.3 Manage Shopping Cart
- Add books to cart
- View cart items
- View individual item prices
- View total cart price
- Remove items from cart
- **Access Level:** Registered Customer

#### 4.4 Checkout Shopping Cart
- Provide credit card number
- Provide credit card expiry date
- Validate credit card information
- Transaction succeeds only if card is valid
- Automatically deduct purchased quantities from stock
- **Access Level:** Registered Customer

#### 4.5 View Past Orders
Display order history with:
- Order number
- Order date
- Book ISBNs
- Book names
- Total price of order
- **Access Level:** Registered Customer

#### 4.6 Logout
- Clears all items from current shopping cart
- **Access Level:** Registered Customer

---

## Technical Requirements

### Database Constraints
- All integrity constraints must be preserved
- Use database constraints and triggers
- Implement validation for all data operations

### Triggers Required
1. **Before Update Trigger:** Prevent negative stock quantities
2. **After Update Trigger:** Automatic order placement when stock drops below threshold

### Sample Data
- System must be populated with sufficient test data
- Must demonstrate all features
- Include book sales and related data

---

## Deliverables

### Project Report Must Include:
1. List of implemented features
2. ERD (Entity-Relationship Diagram)
3. Relational schema
4. Description of logic for each user interface screen

### Team Requirements
- Groups of **four students**
- Each member must clearly identify their contributions
- Document individual roles in the project

### Submission Rules
- **No late submissions allowed**

---

## User Roles Summary

| Feature | Admin | Customer |
|---------|-------|----------|
| Add new books | ✓ | ✗ |
| Modify books | ✓ | ✗ |
| Place orders to publishers | ✓ | ✗ |
| Confirm orders | ✓ | ✗ |
| Generate reports | ✓ | ✗ |
| Search books | ✓ | ✓ |
| Manage shopping cart | ✗ | ✓ |
| Checkout | ✗ | ✓ |
| View past orders | ✗ | ✓ |
| Edit personal info | ✗ | ✓ |

---

## Key Business Rules

1. Books cannot have negative stock quantities
2. Orders are placed automatically when stock drops below threshold
3. Order quantities are constant (predefined)
4. Shopping cart is cleared on logout
5. Only valid credit cards can complete checkout
6. Stock is automatically updated after successful checkout
7. Order confirmation automatically increases stock
8. Books can have multiple authors