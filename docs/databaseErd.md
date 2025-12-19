# 📘 ONLINE BOOKSTORE – FULL ERD

---

## 📕 Book
**Attributes**
- ISBN (PK)
- Title
- PublicationYear
- SellingPrice
- StockLevel
- Threshold

---

## 🗂 Category
**Attributes**
- CategoryID (PK)
- CategoryName

**Relationship**
- Category (1) ──── belongs to ──── (M) Book

---

## ✍ Author
**Attributes**
- AuthorID (PK)
- AuthorName

**Relationship**
- Book (M) ──── written by ──── (M) Author

---

## 🏢 Publisher
**Attributes**
- PublisherID (PK)
- Name
- Address
- {PhoneNumber}   ← multivalued

---

## 👤 User (Superclass)
**Attributes**
- UserID (PK)
- Username
- Password
- Email
- {PhoneNumber}   ← multivalued

---

## 👨‍💼 Admin (Subclass)
**Attributes**
- UserID (PK, FK → User)

---

## 👨‍👩‍👧 Customer (Subclass)
**Attributes**
- UserID (PK, FK → User)
- FirstName
- LastName
- ShippingAddress

**Specialization**
- User ISA {Admin, Customer}

---

## 🛒 ShoppingCart
**Attributes**
- CartID (PK)

**Relationship**
- Customer (1) ──── owns ──── (1) ShoppingCart

---

## 🧾 CartItem
**Attributes**
- Quantity

**Relationships**
- ShoppingCart (1) ──── contains ──── (M) CartItem
- Book         (1) ──── appears in ──── (M) CartItem

---

## 💳 CreditCard (Weak Entity)
**Attributes**
- CardNumber (Partial Key)
- ExpiryDate

**Relationship**
- Customer (1) ──── owns ──── (M) CreditCard

---

## 🧾 SalesTransaction
**Attributes**
- TransactionID (PK)
- TransactionDate
- TotalPrice

**Relationship**
- Customer (1) ──── makes ──── (M) SalesTransaction

---

## 📦 TransactionItem
**Attributes**
- Quantity
- SellingPriceAtTime

**Relationships**
- SalesTransaction (1) ──── includes ──── (M) TransactionItem
- Book             (1) ──── sold in ──── (M) TransactionItem

---

## 📑 ReplenishmentOrder
**Attributes**
- OrderID (PK)
- QuantityRequested
- OrderStatus
- OrderDate

**Relationships**
- Publisher (1) ──── supplies ──── (M) ReplenishmentOrder
- Admin     (1) ──── places  ──── (M) ReplenishmentOrder
- Book      (1) ──── ordered  ──── (M) ReplenishmentOrder