# Order Processing System - Workflow Documentation

## Table of Contents
1. [Administrator Workflows](#administrator-workflows)
2. [Customer Workflows](#customer-workflows)


---

## Administrator Workflows

### 1. Add New Book Workflow

```
START
  ↓
Admin Login
  ↓
Navigate to "Add New Book"
  ↓
Enter Book Information:
  - ISBN
  - Title
  - Author(s)
  - Publisher
  - Publication Year
  - Selling Price
  - Category (Science/Art/Religion/History/Geography)
  - Initial Stock Quantity
  - Threshold (Minimum Stock Level)
  ↓
System Validates Data:
  - Check ISBN uniqueness
  - Validate all required fields
  - Verify publisher exists (or add new)
  - Validate price > 0
  - Validate quantity >= 0
  ↓
[Valid?]
  ↓ YES                    ↓ NO
Save to Database     Display Error Message
  ↓                        ↓
Display Success      Return to Form
  ↓
END
```

---

### 2. Modify Book Workflow

```
START
  ↓
Admin Login
  ↓
Search for Book:
  - By ISBN, Title, Author, Publisher, or Category
  ↓
Display Search Results
  ↓
Select Book to Modify
  ↓
Display Current Book Details
  ↓
Admin Updates Fields:
  - Title, Author, Publisher, Year, Price, Category
  ↓
Submit Changes
  ↓
System Validates:
  - All required fields present
  - Data integrity maintained
  ↓
[Valid?]
  ↓ YES                    ↓ NO
Update Database      Display Error Message
  ↓                        ↓
Display Success      Return to Form
  ↓
END
```

---

### 3. Update Stock Quantity Workflow (Manual)

```
START
  ↓
Admin Login
  ↓
Search for Book
  ↓
Select Book
  ↓
Enter New Quantity or Quantity to Deduct
  ↓
TRIGGER: Before Update
  ↓
Check: New Quantity >= 0?
  ↓ YES                    ↓ NO
Continue              Rollback Transaction
  ↓                        ↓
Update Stock          Display Error: "Cannot have negative stock"
  ↓                        ↓
TRIGGER: After Update      END
  ↓
Check: Quantity dropped below threshold?
  ↓ YES                    ↓ NO
Auto-create Order     Skip Order Creation
  ↓                        ↓
Display Success ←──────────┘
  ↓
END
```

---

### 4. Confirm Publisher Order Workflow

```
START
  ↓
Admin Login
  ↓
Navigate to "Pending Orders"
  ↓
View List of Pending Orders:
  - Order ID
  - Book ISBN & Title
  - Order Quantity
  - Order Date
  - Publisher Name
  ↓
Select Order to Confirm
  ↓
Review Order Details
  ↓
Click "Confirm Order"
  ↓
System Updates:
  - Order Status → "Confirmed"
  - Book Stock += Order Quantity
  ↓
Display Success Message
  ↓
Refresh Order List
  ↓
END
```

---

### 5. Generate Reports Workflow

#### 5a. Total Sales Previous Month

```
START
  ↓
Admin Login
  ↓
Navigate to "Reports" → "Previous Month Sales"
  ↓
System Calculates:
  - Identify previous month date range
  - SUM(total_price) from all orders in that month
  ↓
Display Report:
  - Month/Year
  - Total Sales Amount
  - Number of Orders
  ↓
[Export Option]
  ↓
END
```

#### 5b. Total Sales for Specific Day

```
START
  ↓
Admin Login
  ↓
Navigate to "Reports" → "Daily Sales"
  ↓
Admin Selects Date
  ↓
System Calculates:
  - SUM(total_price) from orders on that date
  ↓
Display Report:
  - Selected Date
  - Total Sales Amount
  - Number of Orders
  - List of Orders (optional details)
  ↓
END
```

#### 5c. Top 5 Customers (Last 3 Months)

```
START
  ↓
Admin Login
  ↓
Navigate to "Reports" → "Top Customers"
  ↓
System Calculates:
  - Date range: Last 3 months from today
  - GROUP BY customer
  - SUM(order_total) per customer
  - ORDER BY total DESC
  - LIMIT 5
  ↓
Display Report:
  - Rank (1-5)
  - Customer Name
  - Total Purchase Amount
  - Number of Orders
  ↓
END
```

#### 5d. Top 10 Selling Books (Last 3 Months)

```
START
  ↓
Admin Login
  ↓
Navigate to "Reports" → "Top Books"
  ↓
System Calculates:
  - Date range: Last 3 months
  - GROUP BY book ISBN
  - SUM(quantity_sold) per book
  - ORDER BY quantity DESC
  - LIMIT 10
  ↓
Display Report:
  - Rank (1-10)
  - ISBN
  - Book Title
  - Author(s)
  - Total Copies Sold
  - Revenue Generated
  ↓
END
```

#### 5e. Total Orders for Specific Book

```
START
  ↓
Admin Login
  ↓
Navigate to "Reports" → "Book Order History"
  ↓
Search for Book (by ISBN or Title)
  ↓
Select Book
  ↓
System Calculates:
  - COUNT(*) from publisher orders for this book
  ↓
Display Report:
  - Book Details (ISBN, Title)
  - Total Number of Orders Placed
  - List of All Orders (Date, Quantity, Status)
  ↓
END
```

---

## Customer Workflows

### 6. Customer Registration Workflow

```
START
  ↓
Navigate to Registration Page
  ↓
Enter Information:
  - Username (unique)
  - Password
  - First Name
  - Last Name
  - Email
  - Phone Number
  - Shipping Address
  ↓
Submit Registration
  ↓
System Validates:
  - Username not taken
  - Email format valid
  - All required fields present
  - Password meets requirements
  ↓
[Valid?]
  ↓ YES                    ↓ NO
Create Account       Display Error Message
  ↓                        ↓
Hash Password        Return to Form
  ↓
Save to Database
  ↓
Display Success & Auto-Login
  ↓
Redirect to Home Page
  ↓
END
```

---

### 7. Customer Login Workflow

```
START
  ↓
Navigate to Login Page
  ↓
Enter Credentials:
  - Username
  - Password
  ↓
Submit Login
  ↓
System Validates:
  - Check username exists
  - Verify password hash
  ↓
[Valid?]
  ↓ YES                    ↓ NO
Create Session       Display Error: "Invalid credentials"
  ↓                        ↓
Load User Data       Return to Login Page
  ↓                        ↓
Initialize Empty Cart     END
  ↓
Redirect to Home Page
  ↓
END
```

---

### 8. Edit Personal Information Workflow

```
START
  ↓
Customer Logged In
  ↓
Navigate to "My Account"
  ↓
Display Current Information
  ↓
Customer Edits:
  - First/Last Name
  - Email
  - Phone
  - Shipping Address
  - Password (optional)
  ↓
Submit Changes
  ↓
[Changing Password?]
  ↓ YES                    ↓ NO
Verify Old Password  Skip Password Check
  ↓                        ↓
[Correct?]          Validate Other Fields
  ↓ YES    ↓ NO            ↓
Continue  Error      [Valid?]
  ↓        ↓               ↓ YES        ↓ NO
Hash New  Return     Update DB   Display Error
Password                   ↓             ↓
  ↓                   Success       Return
Update DB            Message
  ↓                        ↓
Display Success ←──────────┘
  ↓
END
```

---

### 9. Browse and Search Books Workflow

```
START
  ↓
Customer Logged In
  ↓
[Search Method?]
  ↓
├─ Browse All Books
│   ↓
│   Display All Books (Paginated)
│
├─ Search by ISBN
│   ↓
│   Enter ISBN → Display Exact Match
│
├─ Search by Title
│   ↓
│   Enter Title → Display Matching Books
│
├─ Filter by Category
│   ↓
│   Select Category → Display Books in Category
│
├─ Search by Author
│   ↓
│   Enter Author → Display Books by Author
│
└─ Search by Publisher
    ↓
    Enter Publisher → Display Books from Publisher
    ↓
Display Results:
  - Book Title
  - Author(s)
  - ISBN
  - Price
  - Availability Status
  - "Add to Cart" Button
  ↓
[Select Book?]
  ↓ YES                    ↓ NO
View Details         Return to Search
  ↓
END
```

---

### 10. Shopping Cart Management Workflow

#### 10a. Add to Cart

```
START
  ↓
Customer Browsing Books
  ↓
Select Book
  ↓
View Book Details
  ↓
[In Stock?]
  ↓ YES                    ↓ NO
Enter Quantity       Display "Out of Stock"
  ↓                        ↓
[Quantity <= Stock?]      END
  ↓ YES        ↓ NO
Click "Add"  Error: "Insufficient Stock"
  ↓                ↓
Add to Cart  Return to Page
(Session)
  ↓
Display Success: "Added to Cart"
  ↓
[Continue Shopping?]
  ↓ YES                    ↓ NO
Return to Browse     Go to Cart
  ↓                        ↓
END                       END
```

#### 10b. View Cart

```
START
  ↓
Customer Clicks "View Cart"
  ↓
Display Cart Contents:
  For Each Item:
    - Book Title
    - ISBN
    - Unit Price
    - Quantity
    - Subtotal (Price × Quantity)
    - "Remove" Button
  ↓
  Display Cart Summary:
    - Total Items Count
    - Grand Total Price
  ↓
  Display Options:
    - "Continue Shopping" Button
    - "Checkout" Button
    - "Clear Cart" Button
  ↓
END
```

#### 10c. Remove from Cart

```
START
  ↓
Customer in Cart View
  ↓
Click "Remove" on Item
  ↓
Confirm Removal (optional)
  ↓
Remove Item from Session Cart
  ↓
Recalculate Cart Total
  ↓
Refresh Cart Display
  ↓
Display Message: "Item Removed"
  ↓
END
```

---

### 11. Checkout Workflow

```
START
  ↓
Customer in Cart View
  ↓
Click "Checkout"
  ↓
[Cart Empty?]
  ↓ YES                    ↓ NO
Display Error        Display Checkout Page
  ↓                        ↓
Return to Browse     Show Order Summary:
  ↓                    - All items
END                    - Total price
                         ↓
                    Enter Payment Information:
                      - Credit Card Number
                      - Expiry Date
                      - CVV (optional)
                         ↓
                    Click "Place Order"
                         ↓
                    Validate Credit Card:
                      - Format check
                      - Expiry date > today
                         ↓
                    [Valid Card?]
                         ↓ YES                    ↓ NO
                    BEGIN TRANSACTION       Display Error
                         ↓                        ↓
                    For Each Item in Cart:  Return to Checkout
                      - Check stock >= quantity    ↓
                         ↓                        END
                    [All Available?]
                         ↓ YES        ↓ NO
                    Continue     Rollback & Error
                         ↓             ↓
                    Create Order Record    "Some items unavailable"
                         ↓                        ↓
                    Create Order Items          END
                         ↓
                    Update Book Quantities:
                      stock -= purchased_quantity
                         ↓
                    TRIGGER: After Update on Books
                      (Auto-order if below threshold)
                         ↓
                    COMMIT TRANSACTION
                         ↓
                    Clear Shopping Cart
                         ↓
                    Display Success:
                      - Order Number
                      - Order Total
                      - Estimated Delivery
                         ↓
                    Send Confirmation (optional)
                         ↓
                    END
```

---

### 12. View Order History Workflow

```
START
  ↓
Customer Logged In
  ↓
Navigate to "My Orders"
  ↓
System Retrieves:
  - All orders for this customer
  - ORDER BY order_date DESC
  ↓
Display Orders List:
  For Each Order:
    - Order Number
    - Order Date
    - Total Amount
    - Status (Completed)
    - "View Details" Button
  ↓
[Select Order?]
  ↓ YES                    ↓ NO
View Order Details     END
  ↓
Display Detailed View:
  - Order Number
  - Order Date
  - Shipping Address
  - Payment Method (last 4 digits)
  - Items List:
    * ISBN
    * Book Title
    * Quantity
    * Unit Price
    * Subtotal
  - Order Total
  ↓
[Print/Export Option]
  ↓
END
```

---

### 13. Customer Logout Workflow

```
START
  ↓
Customer Clicks "Logout"
  ↓
Confirm Logout (optional warning about cart)
  ↓
Clear Shopping Cart from Session
  ↓
Destroy User Session
  ↓
Clear Authentication Tokens
  ↓
Redirect to Login/Home Page
  ↓
Display Message: "Logged out successfully"
  ↓
END
```

---

## Automated System Workflows

### 14. Automatic Stock Replenishment (Trigger)

```
TRIGGER: After Update on Books Table
  ↓
Check: Was quantity_in_stock modified?
  ↓ YES                    ↓ NO
Continue              Exit Trigger
  ↓
Get OLD quantity and NEW quantity
  ↓
Check Conditions:
  1. OLD.quantity >= threshold
  2. NEW.quantity < threshold
  ↓
[Both conditions met?]
  ↓ YES                    ↓ NO
Stock Dropped Below  Exit Trigger
Threshold
  ↓
Create Publisher Order:
  - order_date = CURRENT_DATE
  - book_isbn = NEW.isbn
  - quantity = PREDEFINED_ORDER_QUANTITY
  - status = 'Pending'
  - publisher_id = book's publisher
  ↓
Insert Order into Database
  ↓
Log Event (optional)
  ↓
END TRIGGER
```

---

### 15. Stock Validation (Before Update Trigger)

```
TRIGGER: Before Update on Books Table
  ↓
Check: Is quantity_in_stock being modified?
  ↓ YES                    ↓ NO
Continue              Allow Update
  ↓                        ↓
Check: NEW.quantity < 0?  END TRIGGER
  ↓ YES                    ↓ NO
RAISE EXCEPTION      Allow Update
"Stock cannot be         ↓
negative"           END TRIGGER
  ↓
ROLLBACK Transaction
  ↓
END TRIGGER
```

---







## System State Diagrams

### Book Stock States

```
┌─────────────┐
│   In Stock  │ (quantity >= threshold)
│  (Normal)   │
└──────┬──────┘
       │
       │ Sale occurs
       │ quantity drops below threshold
       ↓
┌─────────────┐     Auto-order     ┌──────────────┐
│ Below       │─────triggered──────→│   Pending    │
│ Threshold   │                     │ Reorder      │
└──────┬──────┘                     └───────┬──────┘
       │                                    │
       │ More sales                         │ Admin confirms
       │                                    │
       ↓                                    ↓
┌─────────────┐                     ┌──────────────┐
│ Out of      │                     │   Order      │
│ Stock       │←────────────────────│  Confirmed   │
│(quantity=0) │   Awaiting          │              │
└─────────────┘   delivery          └───────┬──────┘
       ↑                                    │
       │                                    │ Stock updated
       │                                    │ quantity += order_qty
       │                                    │
       └────────────────────────────────────┘
                Stock Replenished
         (Returns to "In Stock" state)
```

---

### Order States (Customer Orders)

```
┌─────────────┐
│ Shopping    │
│   Cart      │
│  (Active)   │
└──────┬──────┘
       │
       │ Customer clicks "Checkout"
       │
       ↓
┌─────────────┐
│  Payment    │
│  Validation │
└──────┬──────┘
       │
       │ Card valid
       ↓
┌─────────────┐
│   Order     │
│  Placed     │
│ (Completed) │
└─────────────┘

Alternative Path:
Shopping Cart → Logout → Cart Cleared (Abandoned)
```

---

### User Session States

```
┌─────────────┐
│ Anonymous   │
│   Visitor   │
└──────┬──────┘
       │
       ├─→ Register → Authenticated
       │
       └─→ Login → Authenticated
                      │
                      │ Browse, shop, checkout
                      │
                      ↓
              ┌──────────────┐
              │ Authenticated│
              │   Session    │
              └───────┬──────┘
                      │
                      └─→ Logout → Anonymous Visitor
```

---

## Integration Points

### External System Interactions



2. **Email Notifications** (Optional)
   - Registration confirmation
   - Order confirmation
   - Order status updates

3. **Inventory Management**
   - Real-time stock updates
   - Automatic reordering system
   - Stock threshold monitoring

---



## Security Workflows

### Authentication & Authorization

```
Every Request:
  ↓
Check Session Valid?
  ↓ YES                    ↓ NO
Get User Role        Redirect to Login
  ↓                        ↓
Check Permission     END
for Requested Action
  ↓ GRANTED        ↓ DENIED
Proceed          Display "Access Denied"
  ↓                    ↓
Execute Action   Log Attempt
  ↓                    ↓
END                 END
```

